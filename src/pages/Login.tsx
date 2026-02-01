import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Briefcase, Eye, EyeOff, Shield, Zap } from 'lucide-react';
import Button from '../components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [loading, setLoading] = useState(false);

    // Get the page user was trying to access, or default to generator
    const from = (location.state as any)?.from?.pathname || '/generator';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Authenticate the user
        login(formData.name || 'User', formData.email);

        setLoading(false);
        navigate(from, { replace: true });
    };


    return (
        <div className="min-h-screen pt-32 pb-20 bg-theme-primary flex items-center justify-center relative overflow-hidden transition-colors duration-500">
            {/* Neural Flow Background */}
            <div className="bg-blob -top-20 -left-20 animate-pulse opacity-20"></div>
            <div className="bg-blob bg-blob-purple bottom-20 -right-20 opacity-15"></div>

            <div className="max-w-6xl w-full px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* Left Accents (Visible on Desktop) */}
                    <div className="hidden lg:flex lg:col-span-3 flex-col gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass p-8 flex-1 flex flex-col justify-center glass-hover"
                        >
                            <div className="w-10 h-10 bg-blue/10 rounded-full flex items-center justify-center text-blue mb-4">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2">Zero-Cloud Trust</h3>
                            <p className="text-[10px] text-theme-muted leading-relaxed uppercase font-bold">
                                Your data remains encrypted and stored locally. We never sync your ideas to external servers.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass p-8 flex-1 flex flex-col justify-center glass-hover"
                        >
                            <div className="w-10 h-10 bg-blue/10 rounded-full flex items-center justify-center text-blue mb-4">
                                <Zap size={20} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2">Neural Engine</h3>
                            <p className="text-[10px] text-theme-muted leading-relaxed uppercase font-bold">
                                Powered by local LLM architecture for millisecond response times and ultimate privacy.
                            </p>
                        </motion.div>
                    </div>

                    {/* Main Portal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-6 glass p-10 md:p-16 relative overflow-hidden shadow-2xl border-blue/10"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue opacity-5 -mr-24 -mt-24 rotate-45 pointer-events-none" />

                        {/* Logo & Header */}
                        <div className="text-center mb-12 relative z-10">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue flex items-center justify-center shadow-lg shadow-blue/20">
                                    <Briefcase size={28} className="text-white" />
                                </div>
                                <span className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">
                                    Nexus<span className="text-blue">Biz</span>
                                </span>
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-theme-muted">
                                {isLogin ? 'Initialize Session' : 'Create Architecture'}
                            </h2>
                        </div>

                        {/* Form Switchers */}
                        <div className="flex mb-10 glass p-1 rounded-lg relative z-10">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-md ${isLogin ? 'bg-blue text-white shadow-lg' : 'text-theme-muted hover:text-theme-primary'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-md ${!isLogin ? 'bg-blue text-white shadow-lg' : 'text-theme-muted hover:text-theme-primary'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div
                                        key="signup-name"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-3">Full Identity</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full glass border-blue/10 px-6 py-4 text-sm focus:border-blue/40 focus:outline-none transition-all placeholder:text-theme-muted/50"
                                            placeholder="John Doe"
                                            required={!isLogin}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-3">Neural Address</label>
                                <div className="relative group">
                                    <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-blue transition-colors" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full glass border-blue/10 pl-14 pr-6 py-4 text-sm focus:border-blue/40 focus:outline-none transition-all placeholder:text-theme-muted/50"
                                        placeholder="user@nexusbiz.ai"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-3">Secret Key</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-blue transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full glass border-blue/10 pl-14 pr-14 py-4 text-sm focus:border-blue/40 focus:outline-none transition-all placeholder:text-theme-muted/50"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-blue transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {isLogin && (
                                <div className="text-right">
                                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-blue transition-colors text-right">
                                        Recover Key?
                                    </button>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full py-5 text-xs font-black uppercase tracking-[0.3em] flex justify-center group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {isLogin ? 'Initiate' : 'Establish'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </motion.div>

                    {/* Right Accents (Visible on Desktop) */}
                    <div className="hidden lg:flex lg:col-span-3 flex-col gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass p-8 flex-1 flex flex-col justify-center glass-hover"
                        >
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted mb-6">Quick Connect</h3>
                            <div className="space-y-4">
                                <button className="w-full glass py-3 flex items-center justify-center gap-3 hover:bg-blue/10 transition-colors border-blue/10">
                                    <div className="w-2 h-2 rounded-full bg-blue animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Google Portal</span>
                                </button>
                                <button className="w-full glass py-3 flex items-center justify-center gap-3 hover:bg-theme-secondary/10 transition-colors border-blue/10">
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">GitHub Bridge</span>
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass p-8 flex-1 flex flex-col justify-center glass-hover border-blue/20"
                        >
                            <button
                                onClick={() => navigate('/generator')}
                                className="text-center group"
                            >
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-blue">Guest Access</h3>
                                <p className="text-[10px] text-theme-muted leading-relaxed uppercase font-bold group-hover:text-theme-primary transition-colors">
                                    Continue to Generator without an account. Results will not be saved to identity.
                                </p>
                            </button>
                        </motion.div>
                    </div>

                </div>

                {/* Footer Disclaimer */}
                <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.5em] text-theme-muted mb-4 opacity-50">
                    Neural Engine Architecture v2.0.1 • Authorized Access Only
                </p>
            </div>
        </div>
    );
};

export default Login;
