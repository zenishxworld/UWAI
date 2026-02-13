import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllUniversities } from '@/lib/universityData';
import type { University } from '@/lib/universityData';

interface ROIResult {
    totalCost: number;
    afterTaxSalary: number;
    breakEvenYears: number;
    fiveYearNetGain: number;
    yearlyProjection: { year: number; earnings: number; cumulative: number }[];
}

function parseINR(str: string): number {
    const match = str.replace(/[^\d,₹.-]/g, '').match(/[\d,]+/);
    if (!match) return 0;
    return parseInt(match[0].replace(/,/g, ''), 10);
}

function calculateROI(tuition: number, living: number, salary: number, durationYears: number = 2): ROIResult {
    const totalCost = (tuition + living) * durationYears;
    const taxRate = 0.25;
    const afterTaxSalary = Math.round(salary * (1 - taxRate));
    const breakEvenYears = afterTaxSalary > 0 ? Math.round((totalCost / afterTaxSalary) * 10) / 10 : 0;

    const yearlyProjection = [];
    let cumulative = -totalCost;
    for (let year = 1; year <= 5; year++) {
        const earnings = afterTaxSalary;
        cumulative += earnings;
        yearlyProjection.push({ year, earnings, cumulative });
    }

    return {
        totalCost,
        afterTaxSalary,
        breakEvenYears,
        fiveYearNetGain: cumulative,
        yearlyProjection,
    };
}

export default function ROICalculator() {
    const [universities, setUniversities] = useState<University[]>([]);
    const [selectedA, setSelectedA] = useState('');
    const [selectedB, setSelectedB] = useState('');
    const [mode, setMode] = useState<'single' | 'compare'>('single');
    const [result, setResult] = useState<{ a: ROIResult; b?: ROIResult } | null>(null);

    useEffect(() => {
        getAllUniversities().then(setUniversities);
    }, []);

    const compute = () => {
        const uniA = universities.find(u => u.slug === selectedA);
        if (!uniA) return;

        const tuitionA = parseINR(uniA.annual_tuition_fee_inr);
        const livingA = parseINR(uniA.estimated_annual_living_cost_inr);
        const salaryA = parseINR(uniA.avg_starting_salary_inr);
        const roiA = calculateROI(tuitionA, livingA, salaryA);

        if (mode === 'compare') {
            const uniB = universities.find(u => u.slug === selectedB);
            if (!uniB) return;
            const tuitionB = parseINR(uniB.annual_tuition_fee_inr);
            const livingB = parseINR(uniB.estimated_annual_living_cost_inr);
            const salaryB = parseINR(uniB.avg_starting_salary_inr);
            const roiB = calculateROI(tuitionB, livingB, salaryB);
            setResult({ a: roiA, b: roiB });
        } else {
            setResult({ a: roiA });
        }
    };

    const uniAName = universities.find(u => u.slug === selectedA)?.university_name || 'University A';
    const uniBName = universities.find(u => u.slug === selectedB)?.university_name || 'University B';

    const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />

            <div className="pt-20 md:pt-24 pb-12">
                <div className="container-custom">
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>ROI Calculator</h1>
                        <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>Compare financial outcomes with break-even analysis and 5-year projections</p>
                    </div>

                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        <button onClick={() => { setMode('single'); setResult(null); }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'single' ? 'bg-primary-600 text-white' : ''}`}
                            style={mode !== 'single' ? { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' } : undefined}>
                            Single Analysis
                        </button>
                        <button onClick={() => { setMode('compare'); setResult(null); }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'compare' ? 'bg-primary-600 text-white' : ''}`}
                            style={mode !== 'compare' ? { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' } : undefined}>
                            Compare Two
                        </button>
                    </div>

                    <div className="card mb-8">
                        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Select Universities</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{mode === 'compare' ? 'University A' : 'University'}</label>
                                <select className="input" value={selectedA} onChange={(e) => setSelectedA(e.target.value)}>
                                    <option value="">Select University</option>
                                    {universities.map(u => <option key={u.slug} value={u.slug}>{u.university_name} ({u.country})</option>)}
                                </select>
                            </div>
                            {mode === 'compare' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>University B</label>
                                    <select className="input" value={selectedB} onChange={(e) => setSelectedB(e.target.value)}>
                                        <option value="">Select University</option>
                                        {universities.map(u => <option key={u.slug} value={u.slug}>{u.university_name} ({u.country})</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                        <button onClick={compute} disabled={!selectedA || (mode === 'compare' && !selectedB)} className="btn btn-primary px-8">
                            Calculate ROI
                        </button>
                    </div>

                    {result && (
                        <div className="space-y-6 animate-fade-in">
                            <div className={`grid grid-cols-1 ${mode === 'compare' ? 'md:grid-cols-2' : ''} gap-6`}>
                                <ROICard name={mode === 'compare' ? uniAName : 'Financial Analysis'} subtitle={mode !== 'compare' ? uniAName : undefined} roi={result.a} formatINR={formatINR} />
                                {mode === 'compare' && result.b && (
                                    <ROICard name={uniBName} roi={result.b} formatINR={formatINR} />
                                )}
                            </div>

                            {mode === 'compare' && result.b && (
                                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(59,130,246,0.05))' }}>
                                    <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>📊 Comparison Summary</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                                    <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>Metric</th>
                                                    <th className="px-4 py-2 text-right" style={{ color: 'var(--text-secondary)' }}>{uniAName}</th>
                                                    <th className="px-4 py-2 text-right" style={{ color: 'var(--text-secondary)' }}>{uniBName}</th>
                                                    <th className="px-4 py-2 text-center" style={{ color: 'var(--text-secondary)' }}>Winner</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { label: 'Total Cost', a: result.a.totalCost, b: result.b.totalCost, lower: true },
                                                    { label: 'After-Tax Salary', a: result.a.afterTaxSalary, b: result.b.afterTaxSalary, lower: false },
                                                    { label: 'Break-Even', a: result.a.breakEvenYears, b: result.b.breakEvenYears, lower: true, notMoney: true },
                                                    { label: '5-Year Net Gain', a: result.a.fiveYearNetGain, b: result.b.fiveYearNetGain, lower: false },
                                                ].map(row => (
                                                    <tr key={row.label} style={{ borderTop: '1px solid var(--border-color)' }}>
                                                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{row.label}</td>
                                                        <td className="px-4 py-3 text-right" style={{ color: 'var(--text-primary)' }}>{row.notMoney ? `${row.a} yrs` : formatINR(row.a)}</td>
                                                        <td className="px-4 py-3 text-right" style={{ color: 'var(--text-primary)' }}>{row.notMoney ? `${row.b} yrs` : formatINR(row.b)}</td>
                                                        <td className="px-4 py-3 text-center font-bold text-primary-600">
                                                            {row.lower ? (row.a < row.b ? 'A' : row.b < row.a ? 'B' : 'Tie') : (row.a > row.b ? 'A' : row.b > row.a ? 'B' : 'Tie')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
                                ⚠️ These projections are estimates based on available data. Actual outcomes may vary. See our <a href="/disclaimer" className="text-primary-500 underline">disclaimer</a>.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

function ROICard({ name, subtitle, roi, formatINR }: { name: string; subtitle?: string; roi: ROIResult; formatINR: (n: number) => string }) {
    return (
        <div className="card">
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{name}</h2>
            {subtitle && <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1">Total Investment</p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-300">{formatINR(roi.totalCost)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-1">After-Tax Salary</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">{formatINR(roi.afterTaxSalary)}/yr</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Break-Even</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{roi.breakEvenYears} years</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">5-Year Net Gain</p>
                    <p className={`text-xl font-bold ${roi.fiveYearNetGain >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{formatINR(roi.fiveYearNetGain)}</p>
                </div>
            </div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>5-Year Projection</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead style={{ backgroundColor: 'var(--glass-bg)' }}>
                        <tr>
                            <th className="px-3 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>Year</th>
                            <th className="px-3 py-2 text-right" style={{ color: 'var(--text-secondary)' }}>Net Earnings</th>
                            <th className="px-3 py-2 text-right" style={{ color: 'var(--text-secondary)' }}>Cumulative</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roi.yearlyProjection.map(yr => (
                            <tr key={yr.year} style={{ borderTop: '1px solid var(--border-color)' }}>
                                <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>Year {yr.year}</td>
                                <td className="px-3 py-2 text-right" style={{ color: 'var(--text-primary)' }}>{formatINR(yr.earnings)}</td>
                                <td className={`px-3 py-2 text-right font-medium ${yr.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatINR(yr.cumulative)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
