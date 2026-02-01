import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
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

    const from = (location.state as any)?.from?.pathname || '/generator';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        login(formData.name || 'User', formData.email);
        setLoading(false);
        navigate(from, { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0f0f0f]">
            {/* Animated Gradient Background */}
            <div
                className="fixed inset-0 opacity-100"
                style={{
                    background: 'linear-gradient(-45deg, #0f0f0f, #1a0a2e, #0a1628, #0f0f0f)',
                    backgroundSize: '400% 400%',
                    animation: 'gradientShift 15s ease infinite'
                }}
            />

            {/* Liquid Blobs */}
            <motion.div
                className="fixed w-[600px] h-[600px] rounded-full"
                style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                    filter: 'blur(80px)',
                    top: '-200px',
                    left: '-100px',
                    opacity: 0.4
                }}
                animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -30, 20, 0],
                    scale: [1, 1.05, 0.95, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="fixed w-[500px] h-[500px] rounded-full"
                style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    filter: 'blur(80px)',
                    bottom: '-150px',
                    right: '-100px',
                    opacity: 0.3
                }}
                animate={{
                    x: [0, -20, 30, 0],
                    y: [0, 20, -30, 0],
                    scale: [1, 0.95, 1.05, 1]
                }}
                transition={{ duration: 8, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="fixed w-[400px] h-[400px] rounded-full"
                style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                    filter: 'blur(80px)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.15
                }}
                animate={{
                    scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ duration: 8, delay: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Main Container */}
            <div className="relative z-10 flex flex-col items-center px-6 py-12">
                {/* Logo Area */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="w-20 h-20 mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white rounded-3xl"
                        style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                            boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4)'
                        }}
                        animate={{
                            boxShadow: [
                                '0 20px 60px rgba(99, 102, 241, 0.4)',
                                '0 20px 80px rgba(168, 85, 247, 0.6)',
                                '0 20px 60px rgba(99, 102, 241, 0.4)'
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        N
                    </motion.div>
                    <h1
                        className="text-5xl font-black"
                        style={{
                            background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        NexusBiz
                    </h1>
                    <p className="mt-2 text-sm text-white/50 tracking-[0.3em] uppercase">
                        AI Business Engine
                    </p>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    className="w-full max-w-[440px] p-12 rounded-[32px]"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(40px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5)'
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Tabs */}
                    <div
                        className="flex gap-2 p-1.5 rounded-2xl mb-10"
                        style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                    >
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 text-sm font-semibold rounded-xl transition-all duration-300 ${isLogin
                                    ? 'text-white shadow-lg'
                                    : 'text-white/50 hover:text-white/70'
                                }`}
                            style={isLogin ? {
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'
                            } : {}}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 text-sm font-semibold rounded-xl transition-all duration-300 ${!isLogin
                                    ? 'text-white shadow-lg'
                                    : 'text-white/50 hover:text-white/70'
                                }`}
                            style={!isLogin ? {
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'
                            } : {}}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label className="block text-xs text-white/60 font-semibold mb-3">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl text-white text-[15px] transition-all duration-300 focus:outline-none"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)'
                                            }}
                                            placeholder="John Doe"
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-xs text-white/60 font-semibold mb-3">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                    placeholder="hello@nexusbiz.ai"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-white/60 font-semibold mb-3">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-14 pr-14 py-5 rounded-2xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-2xl text-white font-bold text-[15px] mt-4 flex items-center justify-center gap-2 group disabled:opacity-70"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                                backgroundSize: '200% 200%',
                                animation: 'gradientBtn 3s ease infinite'
                            }}
                            whileHover={{ y: -3, boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-white/40">or continue with</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-3">
                        <motion.button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-white font-semibold text-sm transition-all"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                            whileHover={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                y: -2
                            }}
                        >
                            <span className="text-lg">G</span> Google
                        </motion.button>
                        <motion.button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-white font-semibold text-sm transition-all"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                            whileHover={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                y: -2
                            }}
                        >
                            <span className="text-lg">⌘</span> GitHub
                        </motion.button>
                    </div>
                </motion.div>

                {/* Footer Text */}
                <motion.p
                    className="mt-8 text-xs text-white/30 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    By continuing, you agree to our Terms of Service
                </motion.p>
            </div>

            {/* Global Styles for Animations */}
            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes gradientBtn {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
};

export default Login;
