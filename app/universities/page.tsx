'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScoreCircle from '@/components/ScoreCircle';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function UniversitiesPage() {
    const [universities, setUniversities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCountry, setFilterCountry] = useState('');
    const [maxCost, setMaxCost] = useState('');

    useEffect(() => {
        fetchUniversities();
    }, [filterCountry]);

    const fetchUniversities = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterCountry) params.set('country', filterCountry);
            if (maxCost) params.set('maxCost', maxCost);

            const token = localStorage.getItem('token');
            const headers: Record<string, string> = {};
            if (token) headers.Authorization = `Bearer ${token}`;

            const res = await fetch(`/api/universities?${params}`, { headers });
            const data = await res.json();
            setUniversities(data.universities || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Client-side search filter
    const filtered = universities.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase())
    );

    const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Singapore', 'Netherlands', 'Ireland'];

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />

            <div className="pt-24 pb-12">
                <div className="container-custom">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Find Universities</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Browse and compare universities with personalized match scores</p>
                    </div>

                    {/* Filters */}
                    <div className="card mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Search</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Search by name or city..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Country</label>
                                <select className="input" value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}>
                                    <option value="">All Countries</option>
                                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Max Annual Cost</label>
                                <select className="input" value={maxCost} onChange={(e) => { setMaxCost(e.target.value); fetchUniversities(); }}>
                                    <option value="">Any Budget</option>
                                    <option value="20000">Under $20,000</option>
                                    <option value="40000">Under $40,000</option>
                                    <option value="60000">Under $60,000</option>
                                    <option value="80000">Under $80,000</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{filtered.length} universities found</p>

                    {/* University Grid */}
                    {loading ? (
                        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>No universities match your criteria</p>
                            <button onClick={() => { setSearch(''); setFilterCountry(''); setMaxCost(''); }} className="btn btn-primary mt-4">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map(uni => (
                                <Link key={uni.id} href={`/universities/${uni.id}`} className="card hover:shadow-lg transition-all hover:-translate-y-1 group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold group-hover:opacity-80 transition-all truncate" style={{ color: 'var(--text-primary)' }}>
                                                {uni.name}
                                            </h3>
                                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{uni.city}, {uni.country}</p>
                                        </div>
                                        {uni.matchScore && (
                                            <ScoreCircle score={uni.matchScore.overall} size="sm" />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tuition</p>
                                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>${uni.tuition_fee?.toLocaleString()}</p>
                                        </div>
                                        <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                            <p className="text-xs text-secondary-400">Avg Salary</p>
                                            <p className="font-bold text-green-600 text-sm">${uni.average_salary?.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-secondary-400">
                                        <div className="flex items-center gap-2">
                                            {uni.ranking && <span className="badge badge-info text-xs">Rank #{uni.ranking}</span>}
                                            {uni.scholarship_available && <span className="badge badge-success text-xs">Scholarship</span>}
                                        </div>
                                        <span>IELTS {uni.required_ielts}+</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
