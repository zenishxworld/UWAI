'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setUser(JSON.parse(userStr));

        // Check initial theme
        setIsDark(document.documentElement.classList.contains('dark'));

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    const navLinks = [
        { href: '/explore', label: 'Explore' },
        { href: '/universities', label: 'Universities' },
        { href: '/roi-calculator', label: 'ROI Calculator' },
        { href: '/admits', label: 'Admits' },
        { href: '/transparency', label: 'Transparency' },
    ];

    const userLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/applications', label: 'Applications' },
        { href: '/profile', label: 'Profile' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'glass-strong shadow-soft py-2'
            : 'bg-transparent py-4'
            }`}>
            <div className="container-custom">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2.5 group">
                        <div className="relative w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow transition-all duration-300">
                            <span className="text-white font-bold text-sm tracking-tight">U</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            UWAI<span className="text-primary-500">.ai</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === link.href
                                    ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400'
                                    : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                                    }`}
                                style={pathname !== link.href ? { color: 'var(--text-secondary)' } : {}}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center space-x-3">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-surface-100 dark:hover:bg-surface-800"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <svg className="w-[18px] h-[18px] text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-[18px] h-[18px]" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {user ? (
                            <>
                                {userLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === link.href
                                            ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400'
                                            : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                                            }`}
                                        style={pathname !== link.href ? { color: 'var(--text-secondary)' } : {}}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="w-px h-5 bg-surface-200 dark:bg-surface-700 mx-1" />
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{user.fullName?.split(' ')[0]}</span>
                                <button
                                    onClick={logout}
                                    className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="btn btn-ghost text-sm py-2 px-5">
                                    Log In
                                </Link>
                                <Link href="/signup" className="btn btn-primary text-sm py-2 px-5">
                                    Get Started
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile: Theme Toggle + Menu */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                        <button
                            className="p-2 rounded-full transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="card-glass rounded-2xl p-3 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === link.href
                                    ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400'
                                    : ''
                                    }`}
                                style={pathname !== link.href ? { color: 'var(--text-secondary)' } : {}}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user && userLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === link.href
                                    ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400'
                                    : ''
                                    }`}
                                style={pathname !== link.href ? { color: 'var(--text-secondary)' } : {}}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                            {user ? (
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2.5 text-sm text-red-500 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    Logout ({user.fullName?.split(' ')[0]})
                                </button>
                            ) : (
                                <div className="flex gap-2 px-1">
                                    <Link href="/login" className="btn btn-ghost text-sm py-2.5 flex-1 text-center" onClick={() => setMenuOpen(false)}>Log In</Link>
                                    <Link href="/signup" className="btn btn-primary text-sm py-2.5 flex-1 text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
