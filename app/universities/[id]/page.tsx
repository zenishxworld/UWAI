'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScoreCircle from '@/components/ScoreCircle';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function UniversityDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [university, setUniversity] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tracking, setTracking] = useState(false);
    const [trackMessage, setTrackMessage] = useState('');

    useEffect(() => {
        fetchUniversity();
    }, [params.id]);

    const fetchUniversity = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers: Record<string, string> = {};
            if (token) headers.Authorization = `Bearer ${token}`;

            const res = await fetch(`/api/universities/${params.id}`, { headers });
            if (!res.ok) throw new Error('Not found');
            const data = await res.json();
            setUniversity(data.university);
        } catch {
            router.push('/universities');
        } finally {
            setLoading(false);
        }
    };

    const trackApplication = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        setTracking(true);
        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ universityId: university.id }),
            });
            const data = await res.json();
            if (res.ok) {
                setTrackMessage('✅ Added to your applications!');
            } else {
                setTrackMessage(data.error || 'Failed to track');
            }
        } catch {
            setTrackMessage('Error tracking application');
        } finally {
            setTracking(false);
            setTimeout(() => setTrackMessage(''), 3000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <Navbar />
                <div className="pt-32 flex justify-center"><LoadingSpinner size="lg" /></div>
            </div>
        );
    }

    if (!university) return null;

    const totalCost = university.tuition_fee + university.living_cost;
    const ms = university.matchScore;

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />

            <div className="pt-24 pb-12">
                <div className="container-custom">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center text-sm" style={{ color: 'var(--text-muted)' }}>
                        <Link href="/universities" className="hover:opacity-80 transition-opacity">Universities</Link>
                        <span className="mx-2">/</span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{university.name}</span>
                    </div>

                    {/* Header */}
                    <div className="card mb-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{university.name}</h1>
                                <div className="flex flex-wrap items-center gap-3 mb-4" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {university.city}, {university.country}
                                    </span>
                                    {university.ranking && <span className="badge badge-info">Rank #{university.ranking}</span>}
                                    {university.scholarship_available && <span className="badge badge-success">Scholarships</span>}
                                </div>
                                {university.description && (
                                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{university.description}</p>
                                )}
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={trackApplication}
                                        disabled={tracking}
                                        className="btn btn-primary"
                                    >
                                        {tracking ? 'Adding...' : '📋 Track Application'}
                                    </button>
                                    <Link href={`/roi-calculator?uni=${university.id}`} className="btn btn-outline">
                                        📊 Calculate ROI
                                    </Link>
                                    {university.website && (
                                        <a href={university.website} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                            🔗 Website
                                        </a>
                                    )}
                                </div>
                                {trackMessage && (
                                    <p className="mt-3 text-sm font-medium text-primary-600">{trackMessage}</p>
                                )}
                            </div>

                            {ms && (
                                <div className="flex flex-col items-center gap-2">
                                    <ScoreCircle score={ms.overall} size="lg" label="Match Score" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Key Stats */}
                            <div className="card">
                                <h2 className="text-xl font-bold mb-4">Key Information</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Tuition Fee</p>
                                        <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>${university.tuition_fee?.toLocaleString()}</p>
                                        <p className="text-xs text-secondary-400">per year</p>
                                    </div>
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Living Cost</p>
                                        <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>${university.living_cost?.toLocaleString()}</p>
                                        <p className="text-xs text-secondary-400">per year</p>
                                    </div>
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Total Annual Cost</p>
                                        <p className="text-xl font-bold text-primary-600">${totalCost.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Avg Salary</p>
                                        <p className="text-xl font-bold text-green-600">${university.average_salary?.toLocaleString()}</p>
                                        <p className="text-xs text-secondary-400">after graduation</p>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="card">
                                <h2 className="text-xl font-bold mb-4">Admission Requirements</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="rounded-lg p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Min CGPA</p>
                                        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{university.minimum_cgpa}</p>
                                    </div>
                                    <div className="rounded-lg p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Min IELTS</p>
                                        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{university.required_ielts}</p>
                                    </div>
                                    <div className="rounded-lg p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Acceptance Rate</p>
                                        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{university.acceptance_rate}%</p>
                                    </div>
                                    <div className="rounded-lg p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Visa Difficulty</p>
                                        <p className={`text-2xl font-bold capitalize ${university.visa_difficulty === 'low' ? 'text-green-600' :
                                            university.visa_difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                                            }`}>{university.visa_difficulty}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Programs */}
                            {university.programs?.length > 0 && (
                                <div className="card">
                                    <h2 className="text-xl font-bold mb-4">Available Programs</h2>
                                    <div className="space-y-3">
                                        {university.programs.map((prog: any) => (
                                            <div key={prog.id} className="flex items-center justify-between rounded-lg p-4" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                                <div>
                                                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{prog.name}</p>
                                                    <p className="text-sm capitalize" style={{ color: 'var(--text-muted)' }}>{prog.degree_level} • {prog.duration_years} years</p>
                                                </div>
                                                {prog.tuition_fee && (
                                                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>${prog.tuition_fee.toLocaleString()}/yr</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Match Score Breakdown */}
                            {ms && (
                                <div className="card">
                                    <h2 className="text-xl font-bold mb-4">Score Breakdown</h2>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Academic Fit', score: ms.academic, weight: '40%', color: 'bg-blue-500' },
                                            { label: 'Budget Fit', score: ms.budget, weight: '30%', color: 'bg-green-500' },
                                            { label: 'ROI Score', score: ms.roi, weight: '20%', color: 'bg-yellow-500' },
                                            { label: 'Visa Score', score: ms.visa, weight: '10%', color: 'bg-purple-500' },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium">{item.label} ({item.weight})</span>
                                                    <span className="font-bold">{item.score}/100</span>
                                                </div>
                                                <div className="w-full bg-secondary-200 rounded-full h-2.5">
                                                    <div className={`h-2.5 rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.score}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-secondary-200">
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Break-even: <strong>{ms.breakdown.breakEvenYears} years</strong></p>
                                    </div>
                                </div>
                            )}

                            {/* Admit Stats */}
                            {university.admitStats?.total > 0 && (
                                <div className="card">
                                    <h2 className="text-xl font-bold mb-4">Admit Statistics</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span style={{ color: 'var(--text-secondary)' }}>Total Reports</span>
                                            <span className="font-bold">{university.admitStats.total}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-600">Admitted</span>
                                            <span className="font-bold text-green-600">{university.admitStats.admitted}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-red-600">Rejected</span>
                                            <span className="font-bold text-red-600">{university.admitStats.rejected}</span>
                                        </div>
                                        {university.admitStats.avgCgpa && (
                                            <div className="flex justify-between">
                                                <span style={{ color: 'var(--text-secondary)' }}>Avg CGPA (Admitted)</span>
                                                <span className="font-bold">{university.admitStats.avgCgpa}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Link href={`/admits?university=${university.id}`} className="btn btn-outline w-full mt-4 text-center">
                                        View All Admits
                                    </Link>
                                </div>
                            )}

                            {/* Quick ROI */}
                            <div className="card bg-gradient-to-br from-primary-50 to-blue-50">
                                <h2 className="text-xl font-bold mb-2">Quick ROI</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Cost (2yr)</span>
                                        <span className="font-bold">${(totalCost * 2).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Expected Salary</span>
                                        <span className="font-bold text-green-600">${university.average_salary?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 mt-2">
                                        <span>Break-even</span>
                                        <span className="font-bold text-primary-600">
                                            ~{Math.round((totalCost * 2) / (university.average_salary || 50000) * 10) / 10} years
                                        </span>
                                    </div>
                                </div>
                                <Link href={`/roi-calculator?uni=${university.id}`} className="btn btn-primary w-full mt-4 text-center">
                                    Full ROI Analysis
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
