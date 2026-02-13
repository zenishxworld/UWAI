'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface University {
    rank: number;
    university_name: string;
    city: string;
    type: string;
    popular_english_programs: string[];
    min_cgpa: string;
    ielts_requirement: string;
    gre_required: string;
    annual_tuition_fee_inr: string;
    estimated_annual_living_cost_inr: string;
    program_duration_years: string;
    avg_starting_salary_inr: string;
    employment_rate: string;
    post_study_work_visa: string;
    visa_risk: string;
    website: string;
    source: string;
    country: string;
    slug: string;
}

interface CountryInfo {
    code: string;
    name: string;
    flag: string;
    count: number;
}

export default function ExplorePage() {
    const [universities, setUniversities] = useState<University[]>([]);
    const [countries, setCountries] = useState<CountryInfo[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [greFilter, setGreFilter] = useState('');
    const [visaFilter, setVisaFilter] = useState('');
    const [programFilter, setProgramFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchData();
    }, [selectedCountry, greFilter, visaFilter, programFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCountry) params.set('country', selectedCountry);
            if (search) params.set('q', search);
            if (greFilter) params.set('gre', greFilter);
            if (visaFilter) params.set('visa', visaFilter);
            if (programFilter) params.set('program', programFilter);

            const res = await fetch(`/api/explore?${params}`);
            const data = await res.json();
            setUniversities(data.universities || []);
            setCountries(data.countries || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Client-side search debounce
    const handleSearch = () => {
        fetchData();
    };

    const filteredBySearch = universities.filter(u => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            u.university_name.toLowerCase().includes(q) ||
            u.city.toLowerCase().includes(q) ||
            u.popular_english_programs.some(p => p.toLowerCase().includes(q))
        );
    });

    const getVisaColor = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'low': return 'text-emerald-400';
            case 'medium': return 'text-amber-400';
            case 'high': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getVisaBg = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'low': return 'bg-emerald-500/10 border-emerald-500/20';
            case 'medium': return 'bg-amber-500/10 border-amber-500/20';
            case 'high': return 'bg-red-500/10 border-red-500/20';
            default: return 'bg-gray-500/10 border-gray-500/20';
        }
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCountry(null);
        setGreFilter('');
        setVisaFilter('');
        setProgramFilter('');
    };

    const hasActiveFilters = search || selectedCountry || greFilter || visaFilter || programFilter;

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-mesh overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-teal-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/15 to-indigo-500/15 rounded-full blur-3xl" />
                </div>
                <div className="container-custom relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                            style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <span>🌍</span>
                            <span>{countries.reduce((sum, c) => sum + c.count, 0)}+ Universities • {countries.length} Countries</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                            Explore <span className="bg-gradient-to-r from-indigo-500 to-teal-400 bg-clip-text text-transparent">Universities</span>
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
                            Transparent data on tuition, salaries, visa risk, and programs — all in one place. No commission, no bias.
                        </p>

                        {/* Inline Search */}
                        <div className="max-w-xl mx-auto flex gap-2">
                            <div className="flex-1 relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search university, city, or program…"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-base transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    style={{
                                        backgroundColor: 'var(--glass-bg)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-primary)',
                                        backdropFilter: 'blur(12px)',
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="px-6 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-105"
                                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Country Tabs + Filters */}
            <section className="sticky top-16 z-30 py-4" style={{
                backgroundColor: 'var(--bg-primary)',
                borderBottom: '1px solid var(--border-color)',
                backdropFilter: 'blur(16px)',
            }}>
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Country Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            <button
                                onClick={() => setSelectedCountry(null)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${!selectedCountry
                                    ? 'text-white shadow-lg'
                                    : 'hover:opacity-80'
                                    }`}
                                style={!selectedCountry
                                    ? { background: 'linear-gradient(135deg, var(--primary), var(--accent))' }
                                    : { backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }
                                }
                            >
                                🌍 All
                            </button>
                            {countries.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => setSelectedCountry(c.code)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCountry === c.code
                                        ? 'text-white shadow-lg'
                                        : 'hover:opacity-80'
                                        }`}
                                    style={selectedCountry === c.code
                                        ? { background: 'linear-gradient(135deg, var(--primary), var(--accent))' }
                                        : { backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }
                                    }
                                >
                                    {c.flag} {c.name}
                                    <span className="text-xs opacity-70">({c.count})</span>
                                </button>
                            ))}
                        </div>

                        {/* Filter + View Toggle */}
                        <div className="flex items-center gap-2">
                            {/* GRE Filter */}
                            <select
                                value={greFilter}
                                onChange={(e) => setGreFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                style={{
                                    backgroundColor: 'var(--glass-bg)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <option value="">GRE: Any</option>
                                <option value="no">No GRE</option>
                                <option value="yes">GRE Required</option>
                            </select>

                            {/* Visa Filter */}
                            <select
                                value={visaFilter}
                                onChange={(e) => setVisaFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                style={{
                                    backgroundColor: 'var(--glass-bg)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <option value="">Visa: Any</option>
                                <option value="low">Low Risk</option>
                                <option value="medium">Medium Risk</option>
                            </select>

                            {/* View Toggle */}
                            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 transition-all ${viewMode === 'grid' ? 'text-white' : ''}`}
                                    style={viewMode === 'grid'
                                        ? { background: 'linear-gradient(135deg, var(--primary), var(--accent))' }
                                        : { backgroundColor: 'var(--glass-bg)', color: 'var(--text-secondary)' }
                                    }
                                    title="Grid view"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 transition-all ${viewMode === 'table' ? 'text-white' : ''}`}
                                    style={viewMode === 'table'
                                        ? { background: 'linear-gradient(135deg, var(--primary), var(--accent))' }
                                        : { backgroundColor: 'var(--glass-bg)', color: 'var(--text-secondary)' }
                                    }
                                    title="Table view"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" /></svg>
                                </button>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 transition-all"
                                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                                >
                                    ✕ Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-8" ref={resultsRef}>
                <div className="container-custom">
                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                            {loading ? 'Loading…' : `${filteredBySearch.length} universities found`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--primary)' }} />
                        </div>
                    ) : filteredBySearch.length === 0 ? (
                        <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                            <p className="text-5xl mb-4">🔍</p>
                            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No universities found</p>
                            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
                            <button onClick={clearFilters} className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                                Clear All Filters
                            </button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        /* Grid View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredBySearch.map((uni, idx) => (
                                <Link
                                    key={`${uni.country}-${uni.slug}`}
                                    href={`/explore/${uni.country}/${uni.slug}`}
                                    className="group block rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                                    style={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        animationDelay: `${idx * 30}ms`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0 mr-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                    style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white' }}>
                                                    #{uni.rank}
                                                </span>
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getVisaBg(uni.visa_risk)} ${getVisaColor(uni.visa_risk)}`}>
                                                    {uni.visa_risk} Risk
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-base leading-tight group-hover:opacity-80 transition-opacity truncate" style={{ color: 'var(--text-primary)' }}>
                                                {uni.university_name}
                                            </h3>
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{uni.city} • {uni.type}</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="rounded-xl p-2.5" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                            <p className="text-[10px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: 'var(--text-muted)' }}>Tuition/yr</p>
                                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{uni.annual_tuition_fee_inr.split('(')[0].trim()}</p>
                                        </div>
                                        <div className="rounded-xl p-2.5" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                            <p className="text-[10px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: 'var(--text-muted)' }}>Avg Salary</p>
                                            <p className="text-sm font-bold text-emerald-400">{uni.avg_starting_salary_inr.split('(')[0].trim()}</p>
                                        </div>
                                    </div>

                                    {/* Programs */}
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {uni.popular_english_programs.slice(0, 2).map(p => (
                                            <span key={p} className="text-[11px] px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>
                                                {p.length > 30 ? p.slice(0, 28) + '…' : p}
                                            </span>
                                        ))}
                                        {uni.popular_english_programs.length > 2 && (
                                            <span className="text-[11px] px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--glass-bg)', color: 'var(--text-muted)' }}>
                                                +{uni.popular_english_programs.length - 2}
                                            </span>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                                            <span>IELTS {uni.ielts_requirement}</span>
                                            <span>•</span>
                                            <span>CGPA {uni.min_cgpa.split('(')[0].trim()}</span>
                                        </div>
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        /* Table View */
                        <div className="overflow-x-auto rounded-2xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        {['#', 'University', 'City', 'Tuition (INR/yr)', 'Salary (INR)', 'IELTS', 'GRE', 'Visa', 'Work Visa'].map(h => (
                                            <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBySearch.map(uni => (
                                        <tr key={`${uni.country}-${uni.slug}`} className="transition-colors cursor-pointer hover:opacity-80"
                                            style={{ borderBottom: '1px solid var(--border-color)' }}
                                            onClick={() => window.location.href = `/explore/${uni.country}/${uni.slug}`}
                                        >
                                            <td className="px-4 py-3 font-bold" style={{ color: 'var(--primary)' }}>{uni.rank}</td>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{uni.university_name}</p>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{uni.type}</p>
                                            </td>
                                            <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{uni.city}</td>
                                            <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{uni.annual_tuition_fee_inr.split('(')[0].trim()}</td>
                                            <td className="px-4 py-3 font-semibold text-emerald-400">{uni.avg_starting_salary_inr.split('(')[0].trim()}</td>
                                            <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{uni.ielts_requirement}</td>
                                            <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{uni.gre_required.split('(')[0].trim()}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getVisaBg(uni.visa_risk)} ${getVisaColor(uni.visa_risk)}`}>
                                                    {uni.visa_risk}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{uni.post_study_work_visa}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
