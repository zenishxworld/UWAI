import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
            <div className="container-custom py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
                    <div className="col-span-2 md:col-span-2">
                        <div className="flex items-center space-x-2.5 mb-5">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-sm">U</span>
                            </div>
                            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                UWAI<span className="text-primary-500">.ai</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
                            Commission-free, AI-powered study abroad platform. Make data-driven decisions with transparent match scores and real ROI analysis.
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="badge badge-primary">
                                <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                0% Commission
                            </span>
                            <span className="badge badge-primary">
                                <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Data-Driven
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--text-primary)' }}>Product</h3>
                        <ul className="space-y-3">
                            {[
                                { href: '/explore', label: 'Explore Universities' },
                                { href: '/roi-calculator', label: 'ROI Calculator' },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link to={link.href} className="text-sm transition-colors duration-200 hover:text-primary-500" style={{ color: 'var(--text-tertiary)' }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--text-primary)' }}>Company</h3>
                        <ul className="space-y-3">
                            {[
                                { href: '/transparency', label: 'Transparency' },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link to={link.href} className="text-sm transition-colors duration-200 hover:text-primary-500" style={{ color: 'var(--text-tertiary)' }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--text-primary)' }}>Legal</h3>
                        <ul className="space-y-3">
                            {[
                                { href: '/privacy', label: 'Privacy Policy' },
                                { href: '/terms', label: 'Terms of Service' },
                                { href: '/disclaimer', label: 'Disclaimer' },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link to={link.href} className="text-sm transition-colors duration-200 hover:text-primary-500" style={{ color: 'var(--text-tertiary)' }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        &copy; {new Date().getFullYear()} UWAI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            Built with transparency in India 🇮🇳
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
