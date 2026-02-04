/**
 * Signup Page
 * ============
 * 
 * WHAT THIS PAGE DOES:
 * Provides a beautiful registration form for new users
 * 
 * FEATURES:
 * - Full name, email, and password fields
 * - Password confirmation
 * - Password strength indicator
 * - Real-time validation feedback
 * - Terms of service agreement
 * - Auto-login after successful signup
 * 
 * WHY USERS NEED THIS:
 * This is how they create their account to save business ideas!
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, Check, X, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/useAuthStore';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { signup, isLoading, error, clearError, user } = useAuthStore();

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/generator', { replace: true });
        }
    }, [user, navigate]);

    // Clear errors on unmount
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    /**
     * Password strength calculator
     * Returns score 0-4 and feedback
     */
    const passwordStrength = useMemo(() => {
        if (!password) return { score: 0, label: '', color: '' };

        let score = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        if (checks.length) score++;
        if (checks.uppercase) score++;
        if (checks.lowercase) score++;
        if (checks.number) score++;
        if (checks.special) score++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
        const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

        return {
            score,
            label: labels[score],
            color: colors[score],
            checks,
        };
    }, [password]);

    /**
     * Handle signup form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName || !email || !password || !confirmPassword) {
            return;
        }

        if (password !== confirmPassword) {
            return;
        }

        if (!agreedToTerms) {
            return;
        }

        const success = await signup(email, password, fullName);

        if (success) {
            // Redirect to generator to start creating ideas
            navigate('/generator', { replace: true });
        }
    };

    // Check if form is valid
    const isFormValid =
        fullName.length >= 2 &&
        email.includes('@') &&
        passwordStrength.score >= 3 &&
        password === confirmPassword &&
        agreedToTerms;

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
                        Create Account
                    </h1>
                    <p className="text-gray-400">
                        Start generating business ideas for free
                    </p>
                </motion.div>

                {/* Signup Form */}
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name Field */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-gray-900 border border-gray-700 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

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

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 ${i <= passwordStrength.score
                                                        ? passwordStrength.color
                                                        : 'bg-gray-700'
                                                    } transition-colors`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Password strength: <span className={passwordStrength.score >= 3 ? 'text-green-400' : 'text-yellow-400'}>{passwordStrength.label}</span>
                                    </p>
                                </div>
                            )}

                            {/* Password Requirements */}
                            {password && passwordStrength.checks && (
                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                    <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-400' : 'text-gray-500'}`}>
                                        {passwordStrength.checks.length ? <Check size={12} /> : <X size={12} />}
                                        8+ characters
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-400' : 'text-gray-500'}`}>
                                        {passwordStrength.checks.uppercase ? <Check size={12} /> : <X size={12} />}
                                        Uppercase
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-400' : 'text-gray-500'}`}>
                                        {passwordStrength.checks.lowercase ? <Check size={12} /> : <X size={12} />}
                                        Lowercase
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? 'text-green-400' : 'text-gray-500'}`}>
                                        {passwordStrength.checks.number ? <Check size={12} /> : <X size={12} />}
                                        Number
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-gray-900 border pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${confirmPassword && password !== confirmPassword
                                            ? 'border-red-500'
                                            : confirmPassword && password === confirmPassword
                                                ? 'border-green-500'
                                                : 'border-gray-700 focus:border-blue-500'
                                        }`}
                                    required
                                    disabled={isLoading}
                                />
                                {confirmPassword && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {password === confirmPassword ? (
                                            <Check className="text-green-500" size={20} />
                                        ) : (
                                            <X className="text-red-500" size={20} />
                                        )}
                                    </div>
                                )}
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-red-400 mt-1">Passwords don't match</p>
                            )}
                        </div>

                        {/* Terms Agreement */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="w-4 h-4 mt-1 bg-gray-900 border border-gray-700 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-400">
                                I agree to the{' '}
                                <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full justify-center py-4"
                            disabled={isLoading || !isFormValid}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
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

                    {/* Login Link */}
                    <p className="text-center text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                        >
                            Log in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
