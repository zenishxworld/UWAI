'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function UniversityDetailPage({ params }: { params: { country: string; slug: string } }) {
    const router = useRouter();
    const [uni, setUni] = useState<University | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUniversity();
    }, [params.country, params.slug]);

    const fetchUniversity = async () => {
        try {
            const res = await fetch(`/api/explore?country=${params.country}&slug=${params.slug}`);
            if (!res.ok) throw new Error('Not found');
            const data = await res.json();
            setUni(data.university);
        } catch {
            router.push('/explore');
        } finally {
            setLoading(false);
        }
    };

    const getVisaColor = (risk: string) => {
        switch (risk?.toLowerCase()) {
            case 'low': return 'text-emerald-400';
            case 'medium': return 'text-amber-400';
            case 'high': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getVisaBg = (risk: string) => {
        switch (risk?.toLowerCase()) {
            case 'low': return 'bg-emerald-500/10 border-emerald-500/20';
            case 'medium': return 'bg-amber-500/10 border-amber-500/20';
            case 'high': return 'bg-red-500/10 border-red-500/20';
            default: return 'bg-gray-500/10 border-gray-500/20';
        }
    };

    const countryNames: Record<string, string> = { canada: 'Canada', germany: 'Germany' };
    const countryFlags: Record<string, string> = { canada: '🇨🇦', germany: '🇩🇪' };

    if (loading) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <Navbar />
                <div className="pt-32 flex justify-center">
                    <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--primary)' }} />
                </div>
            </div>
        );
    }

    if (!uni) return null;

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />

            {/* Hero Strip */}
            <section className="relative pt-28 pb-10 bg-mesh overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-indigo-500/20 to-teal-500/20 rounded-full blur-3xl" />
                </div>
                <div className="container-custom relative z-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                        <Link href="/explore" className="hover:text-indigo-400 transition-colors">Explore</Link>
                        <span>/</span>
                        <Link href={`/explore?country=${params.country}`} className="hover:text-indigo-400 transition-colors capitalize">
                            {countryFlags[params.country]} {countryNames[params.country] || params.country}
                        </Link>
                        <span>/</span>
                        <span style={{ color: 'var(--text-primary)' }}>{uni.university_name}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-sm font-bold px-3 py-1 rounded-full text-white"
                                    style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                                    Rank #{uni.rank}
                                </span>
                                <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getVisaBg(uni.visa_risk)} ${getVisaColor(uni.visa_risk)}`}>
                                    {uni.visa_risk} Visa Risk
                                </span>
                                <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                    {uni.type}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                                {uni.university_name}
                            </h1>
                            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                                📍 {uni.city} • {countryFlags[params.country]} {countryNames[params.country] || params.country}
                            </p>
                        </div>

                        <div className="flex gap-3 flex-shrink-0">
                            {uni.website && (
                                <a href={uni.website} target="_blank" rel="noopener noreferrer"
                                    className="px-5 py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105 text-sm"
                                    style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                                    🔗 Visit Website
                                </a>
                            )}
                            {uni.source && (
                                <a href={uni.source} target="_blank" rel="noopener noreferrer"
                                    className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                                    style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                    📄 Fee Source
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Financial Overview */}
                            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>💰 Financial Overview</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Annual Tuition</p>
                                        <p className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>{uni.annual_tuition_fee_inr}</p>
                                    </div>
                                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Living Cost/yr</p>
                                        <p className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>{uni.estimated_annual_living_cost_inr}</p>
                                    </div>
                                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Avg Starting Salary</p>
                                        <p className="text-lg font-extrabold text-emerald-400">{uni.avg_starting_salary_inr}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Admission Requirements */}
                            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>📋 Admission Requirements</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Min CGPA</p>
                                        <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{uni.min_cgpa}</p>
                                    </div>
                                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>IELTS</p>
                                        <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{uni.ielts_requirement}</p>
                                    </div>
                                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>GRE Required</p>
                                        <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{uni.gre_required}</p>
                                    </div>
                                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--glass-bg)' }}>
                                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Duration</p>
                                        <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{uni.program_duration_years} years</p>
                                    </div>
                                </div>
                            </div>

                            {/* Programs */}
                            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>🎓 Popular English Programs</h2>
                                <div className="space-y-2">
                                    {uni.popular_english_programs.map((prog, i) => (
                                        <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.01]"
                                            style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                                                {i + 1}
                                            </span>
                                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{prog}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>📊 Key Stats</h2>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Employment Rate', value: uni.employment_rate, icon: '💼' },
                                        { label: 'Post-Study Work Visa', value: uni.post_study_work_visa, icon: '🛂' },
                                        { label: 'Visa Risk', value: uni.visa_risk, icon: '⚠️' },
                                        { label: 'Program Duration', value: `${uni.program_duration_years} years`, icon: '⏱️' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                                <span>{item.icon}</span> {item.label}
                                            </span>
                                            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ROI Card */}
                            <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(20,184,166,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
                                <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>🚀 Quick ROI Snapshot</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span style={{ color: 'var(--text-secondary)' }}>Tuition</span>
                                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{uni.annual_tuition_fee_inr.split('(')[0].trim()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span style={{ color: 'var(--text-secondary)' }}>Living Cost</span>
                                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{uni.estimated_annual_living_cost_inr.split('(')[0].trim()}</span>
                                    </div>
                                    <div className="pt-2" style={{ borderTop: '1px solid rgba(99,102,241,0.2)' }}>
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: 'var(--text-secondary)' }}>Expected Salary</span>
                                            <span className="font-bold text-emerald-400">{uni.avg_starting_salary_inr.split('(')[0].trim()}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/roi-calculator`}
                                    className="block w-full mt-4 px-4 py-2.5 rounded-xl font-semibold text-white text-center text-sm transition-all hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                                    📊 Full ROI Analysis
                                </Link>
                            </div>

                            {/* CTA */}
                            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                <p className="text-2xl mb-3">🎯</p>
                                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Interested?</h3>
                                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Get matched with this university and track your application</p>
                                <Link href="/register"
                                    className="block w-full px-4 py-2.5 rounded-xl font-semibold text-white text-center text-sm transition-all hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                                    Create Free Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
