/**
 * Login Page
 * ===========
 * 
 * WHAT THIS PAGE DOES:
 * Provides a beautiful login form for users to access their account
 * 
 * FEATURES:
 * - Email and password input with validation
 * - "Remember me" visual indicator
 * - Link to signup for new users
 * - Error messages for wrong credentials
 * - Loading state during authentication
 * - Animated with Framer Motion
 * 
 * WHY USERS NEED THIS:
 * This is how they access their saved business ideas and history!
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/useAuthStore';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error, clearError, user } = useAuthStore();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            // Redirect to the page they were trying to access, or results
            const from = (location.state as any)?.from?.pathname || '/results';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    // Clear errors on unmount
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    /**
     * Handle login form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        const success = await login(email, password);

        if (success) {
            // Redirect to results or intended page
            const from = (location.state as any)?.from?.pathname || '/results';
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-20 flex items-center justify-center geometric-grid">
            <div className="w-full max-w-md px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
                        <Sparkles size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400">
                        Log in to access your business ideas
                    </p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-black border border-gray-700 p-8"
                >
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 flex items-start gap-3"
                        >
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-gray-900 border border-gray-700 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-900 border border-gray-700 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 bg-gray-900 border border-gray-700 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-400">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full justify-center py-4"
                            disabled={isLoading || !email || !password}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    Log In
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-black text-gray-500">or</span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-400">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                        >
                            Sign up for free
                        </Link>
                    </p>
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center text-gray-500 text-sm mt-8"
                >
                    By logging in, you agree to our{' '}
                    <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                        Privacy Policy
                    </Link>
                </motion.p>
            </div>
        </div>
    );
};

export default Login;
