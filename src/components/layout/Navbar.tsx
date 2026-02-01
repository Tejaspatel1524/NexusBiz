import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Briefcase, Settings, LogIn, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { cn } from '../common/Button';
import { useLanguage } from '../../i18n';
import { useThemeStore } from '../../store/useThemeStore';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();
    const { isDarkMode, toggleTheme } = useThemeStore();

    const navLinks = [
        { name: t('home'), path: '/' },
        { name: t('generator'), path: '/generator' },
        { name: t('dashboard'), path: '/results' },
        { name: t('pricing'), path: '/pricing' },
        { name: t('about'), path: '/about' },
    ];

    const userMenuItems = [
        { name: t('dashboard'), icon: LayoutDashboard, action: () => navigate('/results') },
        { name: t('settings'), icon: Settings, action: () => navigate('/settings') },
        { name: t('login'), icon: LogIn, action: () => navigate('/login') },
    ];


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue flex items-center justify-center">
                            <Briefcase size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase">Nexus<span className="text-blue">Biz</span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    'text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:text-blue',
                                    location.pathname === link.path ? 'text-blue' : 'text-gray-100'
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* User Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className={cn(
                                    "p-2 border transition-all duration-200",
                                    userMenuOpen
                                        ? "bg-blue border-blue text-white"
                                        : "border-gray-400 text-gray-100 hover:border-blue hover:text-blue"
                                )}
                            >
                                <User size={18} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-400 shadow-xl z-50">
                                    {userMenuItems.map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() => {
                                                item.action();
                                                setUserMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-100 hover:bg-gray-500 hover:text-blue transition-colors text-left"
                                        >
                                            <item.icon size={16} />
                                            <span>{item.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 border border-gray-400 text-gray-100 hover:border-blue hover:text-blue transition-all duration-300 theme-toggle"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-100 hover:text-white"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-500 border-b border-gray-400 px-4 pt-2 pb-6 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                'block text-sm font-bold uppercase tracking-widest',
                                location.pathname === link.path ? 'text-blue' : 'text-gray-100'
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-gray-400 space-y-2">
                        {userMenuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => {
                                    item.action();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 text-gray-100 font-bold uppercase tracking-widest text-sm w-full text-left py-2"
                            >
                                <item.icon size={18} />
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

