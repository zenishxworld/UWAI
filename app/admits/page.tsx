'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdmitsPage() {
    const [admits, setAdmits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCountry, setFilterCountry] = useState('');
    const [filterType, setFilterType] = useState('');

    const fetchAdmits = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filterCountry) params.set('country', filterCountry);
            if (filterType) params.set('type', filterType);

            const res = await fetch(`/api/admits?${params}`);
            const data = await res.json();
            setAdmits(data.admits || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filterCountry, filterType]);

    useEffect(() => {
        fetchAdmits();
    }, [fetchAdmits]);

    const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Singapore'];

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />

            <div className="pt-24 pb-12">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Verified Admits</h1>
                            <p style={{ color: 'var(--text-secondary)' }}>Real admit data from students with verified profiles</p>
                        </div>
                        <Link href="/admits/upload" className="btn btn-primary">
                            📤 Share Your Admit
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="card mb-8">
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Country</label>
                                <select className="input" value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}>
                                    <option value="">All Countries</option>
                                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Result</label>
                                <select className="input" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                    <option value="">All Results</option>
                                    <option value="admit">Admitted ✅</option>
                                    <option value="reject">Rejected ❌</option>
                                    <option value="waitlist">Waitlisted ⏳</option>
                                </select>
                            </div>
                            {(filterCountry || filterType) && (
                                <div className="flex items-end">
                                    <button onClick={() => { setFilterCountry(''); setFilterType(''); }} className="btn btn-outline text-sm">
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
                    ) : admits.length === 0 ? (
                        <div className="card text-center py-16">
                            <p className="text-xl font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>No admits found</p>
                            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Be the first to share your admit experience!</p>
                            <Link href="/admits/upload" className="btn btn-primary">Share Your Admit</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {admits.map(admit => (
                                <div key={admit.id} className="card hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{admit.university_name}</h3>
                                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{admit.university_country}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${admit.admit_type === 'admit' ? 'bg-green-100 text-green-700' :
                                            admit.admit_type === 'reject' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {admit.admit_type === 'admit' ? '✅ Admitted' :
                                                admit.admit_type === 'reject' ? '❌ Rejected' : '⏳ Waitlisted'}
                                        </span>
                                    </div>

                                    {admit.program && (
                                        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{admit.program}</p>
                                    )}

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {admit.cgpa && (
                                            <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>CGPA</p>
                                                <p className="font-bold">{admit.cgpa}</p>
                                            </div>
                                        )}
                                        {admit.ielts && (
                                            <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>IELTS</p>
                                                <p className="font-bold">{admit.ielts}</p>
                                            </div>
                                        )}
                                        {admit.gre && (
                                            <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>GRE</p>
                                                <p className="font-bold">{admit.gre}</p>
                                            </div>
                                        )}
                                        {admit.work_experience > 0 && (
                                            <div className="bg-secondary-50 rounded-lg p-2 text-center">
                                                <p className="text-secondary-500 text-xs">Experience</p>
                                                <p className="font-bold">{admit.work_experience} yrs</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-xs text-secondary-400">
                                        <span>Year: {admit.year}</span>
                                        <span className="flex items-center text-green-600">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
