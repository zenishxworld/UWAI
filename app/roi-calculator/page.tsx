'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ROICalculatorPage() {
    const searchParams = useSearchParams();
    const [universities, setUniversities] = useState<any[]>([]);
    const [selectedUniA, setSelectedUniA] = useState('');
    const [selectedUniB, setSelectedUniB] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [loanRate, setLoanRate] = useState('7');
    const [loanTerm, setLoanTerm] = useState('10');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'single' | 'compare'>('single');

    useEffect(() => {
        fetchUniversities();
    }, []);

    useEffect(() => {
        const uniId = searchParams.get('uni');
        if (uniId) setSelectedUniA(uniId);
    }, [searchParams]);

    const fetchUniversities = async () => {
        const res = await fetch('/api/universities');
        const data = await res.json();
        setUniversities(data.universities || []);
    };

    const calculateROI = async () => {
        const uniA = universities.find(u => u.id === parseInt(selectedUniA));
        if (!uniA) return;

        setLoading(true);
        try {
            if (mode === 'compare') {
                const uniB = universities.find(u => u.id === parseInt(selectedUniB));
                if (!uniB) return;

                const res = await fetch('/api/roi', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mode: 'compare',
                        universityA: {
                            tuition_fee: uniA.tuition_fee,
                            living_cost: uniA.living_cost,
                            duration_years: 2,
                            average_salary: uniA.average_salary,
                            country: uniA.country,
                            loan_amount: loanAmount ? parseFloat(loanAmount) : undefined,
                            loan_rate: parseFloat(loanRate),
                            loan_term_years: parseInt(loanTerm),
                        },
                        universityB: {
                            tuition_fee: uniB.tuition_fee,
                            living_cost: uniB.living_cost,
                            duration_years: 2,
                            average_salary: uniB.average_salary,
                            country: uniB.country,
                            loan_amount: loanAmount ? parseFloat(loanAmount) : undefined,
                            loan_rate: parseFloat(loanRate),
                            loan_term_years: parseInt(loanTerm),
                        },
                    }),
                });
                setResult(await res.json());
            } else {
                const res = await fetch('/api/roi', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tuition_fee: uniA.tuition_fee,
                        living_cost: uniA.living_cost,
                        duration_years: 2,
                        average_salary: uniA.average_salary,
                        country: uniA.country,
                        loan_amount: loanAmount ? parseFloat(loanAmount) : undefined,
                        loan_rate: parseFloat(loanRate),
                        loan_term_years: parseInt(loanTerm),
                    }),
                });
                setResult(await res.json());
            }
        } catch {
            console.error('ROI calculation error');
        } finally {
            setLoading(false);
        }
    };

    const roi = mode === 'compare' ? result?.universityA : result?.roi;
    const roiB = result?.universityB;
    const uniAName = universities.find(u => u.id === parseInt(selectedUniA))?.name || 'University A';
    const uniBName = universities.find(u => u.id === parseInt(selectedUniB))?.name || 'University B';

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />

            <div className="pt-24 pb-12">
                <div className="container-custom">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>ROI Calculator</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Compare financial outcomes with break-even analysis and 5-year projections</p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => { setMode('single'); setResult(null); }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'single' ? 'bg-primary-600 text-white' : 'border hover:border-primary-300'}`}
                            style={mode !== 'single' ? { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' } : undefined}
                        >
                            Single Analysis
                        </button>
                        <button
                            onClick={() => { setMode('compare'); setResult(null); }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'compare' ? 'bg-primary-600 text-white' : 'border hover:border-primary-300'}`}
                            style={mode !== 'compare' ? { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' } : undefined}
                        >
                            Compare Two
                        </button>
                    </div>

                    {/* Input Form */}
                    <div className="card mb-8">
                        <h2 className="text-lg font-semibold mb-4">Select Universities</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    {mode === 'compare' ? 'University A' : 'University'}
                                </label>
                                <select className="input" value={selectedUniA} onChange={(e) => setSelectedUniA(e.target.value)}>
                                    <option value="">Select University</option>
                                    {universities.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.country})</option>
                                    ))}
                                </select>
                            </div>
                            {mode === 'compare' && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">University B</label>
                                    <select className="input" value={selectedUniB} onChange={(e) => setSelectedUniB(e.target.value)}>
                                        <option value="">Select University</option>
                                        {universities.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.country})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold mb-3">Loan Details (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Loan Amount ($)</label>
                                <input type="number" className="input" placeholder="e.g. 50000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Interest Rate (%)</label>
                                <input type="number" className="input" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} step="0.1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Loan Term (years)</label>
                                <input type="number" className="input" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} />
                            </div>
                        </div>

                        <button
                            onClick={calculateROI}
                            disabled={loading || !selectedUniA || (mode === 'compare' && !selectedUniB)}
                            className="btn btn-primary px-8"
                        >
                            {loading ? 'Calculating...' : 'Calculate ROI'}
                        </button>
                    </div>

                    {/* Results */}
                    {roi && (
                        <div className="space-y-6 animate-fade-in">
                            <div className={`grid grid-cols-1 ${mode === 'compare' ? 'md:grid-cols-2' : ''} gap-6`}>
                                {/* University A Results */}
                                <div className="card">
                                    <h2 className="text-xl font-bold mb-1">{mode === 'compare' ? uniAName : 'Financial Analysis'}</h2>
                                    {mode !== 'compare' && <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{uniAName}</p>}

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-red-50 rounded-lg p-4 text-center">
                                            <p className="text-xs text-red-600 mb-1">Total Investment</p>
                                            <p className="text-xl font-bold text-red-700">${roi.totalCost.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4 text-center">
                                            <p className="text-xs text-green-600 mb-1">After-Tax Salary</p>
                                            <p className="text-xl font-bold text-green-700">${roi.afterTaxSalary.toLocaleString()}/yr</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                                            <p className="text-xs text-blue-600 mb-1">Break-Even</p>
                                            <p className="text-xl font-bold text-blue-700">{roi.breakEvenYears} years</p>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                                            <p className="text-xs text-purple-600 mb-1">5-Year Net Gain</p>
                                            <p className={`text-xl font-bold ${roi.fiveYearNetGain >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                ${roi.fiveYearNetGain.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {roi.monthlyLoanPayment > 0 && (
                                        <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                                            <p className="text-sm font-medium text-yellow-800">
                                                Monthly Loan Payment: <strong>${roi.monthlyLoanPayment.toLocaleString()}</strong>
                                            </p>
                                            <p className="text-xs text-yellow-600">Total Interest: ${roi.totalLoanInterest.toLocaleString()}</p>
                                        </div>
                                    )}

                                    {/* Yearly Projection */}
                                    <h3 className="font-semibold mb-3">5-Year Projection</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead style={{ backgroundColor: 'var(--glass-bg)' }}>
                                                <tr>
                                                    <th className="px-3 py-2 text-left">Year</th>
                                                    <th className="px-3 py-2 text-right">Net Earnings</th>
                                                    <th className="px-3 py-2 text-right">Cumulative</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {roi.yearlyProjection.map((yr: any) => (
                                                    <tr key={yr.year} className="border-t">
                                                        <td className="px-3 py-2">Year {yr.year}</td>
                                                        <td className="px-3 py-2 text-right">${yr.earnings.toLocaleString()}</td>
                                                        <td className={`px-3 py-2 text-right font-medium ${yr.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            ${yr.cumulative.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* University B Results (comparison mode) */}
                                {mode === 'compare' && roiB && (
                                    <div className="card">
                                        <h2 className="text-xl font-bold mb-4">{uniBName}</h2>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-red-50 rounded-lg p-4 text-center">
                                                <p className="text-xs text-red-600 mb-1">Total Investment</p>
                                                <p className="text-xl font-bold text-red-700">${roiB.totalCost.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                                <p className="text-xs text-green-600 mb-1">After-Tax Salary</p>
                                                <p className="text-xl font-bold text-green-700">${roiB.afterTaxSalary.toLocaleString()}/yr</p>
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                                <p className="text-xs text-blue-600 mb-1">Break-Even</p>
                                                <p className="text-xl font-bold text-blue-700">{roiB.breakEvenYears} years</p>
                                            </div>
                                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                                <p className="text-xs text-purple-600 mb-1">5-Year Net Gain</p>
                                                <p className={`text-xl font-bold ${roiB.fiveYearNetGain >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                    ${roiB.fiveYearNetGain.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {roiB.monthlyLoanPayment > 0 && (
                                            <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                                                <p className="text-sm font-medium text-yellow-800">
                                                    Monthly Loan Payment: <strong>${roiB.monthlyLoanPayment.toLocaleString()}</strong>
                                                </p>
                                                <p className="text-xs text-yellow-600">Total Interest: ${roiB.totalLoanInterest.toLocaleString()}</p>
                                            </div>
                                        )}

                                        <h3 className="font-semibold mb-3">5-Year Projection</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead style={{ backgroundColor: 'var(--glass-bg)' }}>
                                                    <tr>
                                                        <th className="px-3 py-2 text-left">Year</th>
                                                        <th className="px-3 py-2 text-right">Net Earnings</th>
                                                        <th className="px-3 py-2 text-right">Cumulative</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {roiB.yearlyProjection.map((yr: any) => (
                                                        <tr key={yr.year} className="border-t">
                                                            <td className="px-3 py-2">Year {yr.year}</td>
                                                            <td className="px-3 py-2 text-right">${yr.earnings.toLocaleString()}</td>
                                                            <td className={`px-3 py-2 text-right font-medium ${yr.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                ${yr.cumulative.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Comparison Summary */}
                            {mode === 'compare' && roi && roiB && (
                                <div className="card bg-gradient-to-r from-primary-50 to-blue-50">
                                    <h2 className="text-xl font-bold mb-4">📊 Comparison Summary</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b-2">
                                                    <th className="px-4 py-2 text-left">Metric</th>
                                                    <th className="px-4 py-2 text-right">{uniAName}</th>
                                                    <th className="px-4 py-2 text-right">{uniBName}</th>
                                                    <th className="px-4 py-2 text-center">Winner</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { label: 'Total Cost', a: roi.totalCost, b: roiB.totalCost, lower: true },
                                                    { label: 'After-Tax Salary', a: roi.afterTaxSalary, b: roiB.afterTaxSalary, lower: false },
                                                    { label: 'Break-Even', a: roi.breakEvenYears, b: roiB.breakEvenYears, lower: true, notMoney: true },
                                                    { label: '5-Year Net Gain', a: roi.fiveYearNetGain, b: roiB.fiveYearNetGain, lower: false },
                                                ].map(row => (
                                                    <tr key={row.label} className="border-t">
                                                        <td className="px-4 py-3 font-medium">{row.label}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            {row.notMoney ? `${row.a} yrs` : `$${row.a.toLocaleString()}`}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            {row.notMoney ? `${row.b} yrs` : `$${row.b.toLocaleString()}`}
                                                        </td>
                                                        <td className="px-4 py-3 text-center font-bold text-primary-600">
                                                            {row.lower
                                                                ? (row.a < row.b ? 'A' : row.b < row.a ? 'B' : 'Tie')
                                                                : (row.a > row.b ? 'A' : row.b > row.a ? 'B' : 'Tie')
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="text-xs text-secondary-400 text-center">
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
