import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, Briefcase, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate login/signup
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For demo, just navigate to generator
        setLoading(false);
        navigate('/generator');
    };

    return (
        <div className="min-h-screen pt-32 pb-20 geometric-grid flex items-center justify-center">
            <div className="w-full max-w-md px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black border border-gray-400 p-8"
                >
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-blue flex items-center justify-center">
                            <Briefcase size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter uppercase">
                            Nexus<span className="text-blue">Biz</span>
                        </span>
                    </div>

                    {/* Tab Switch */}
                    <div className="flex mb-8 border border-gray-400">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${isLogin ? 'bg-blue text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${!isLogin ? 'bg-blue text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name field for signup */}
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-500 border border-gray-400 px-4 py-3 text-white placeholder-gray-400 focus:border-blue focus:outline-none transition-colors"
                                    placeholder="John Doe"
                                    required={!isLogin}
                                />
                            </motion.div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-gray-500 border border-gray-400 pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue focus:outline-none transition-colors"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-gray-500 border border-gray-400 pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:border-blue focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password (login only) */}
                        {isLogin && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="text-sm text-gray-400 hover:text-blue transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isLogin ? <LogIn size={18} /> : <ArrowRight size={18} />}
                                    {isLogin ? 'Login' : 'Create Account'}
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-gray-400" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-gray-400" />
                    </div>

                    {/* Continue as Guest */}
                    <Button
                        variant="outline"
                        onClick={() => navigate('/generator')}
                        className="w-full justify-center"
                    >
                        Continue as Guest
                    </Button>

                    {/* Privacy Note */}
                    <p className="text-xs text-gray-500 text-center mt-6">
                        All AI processing happens locally. Your data never leaves your computer.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
