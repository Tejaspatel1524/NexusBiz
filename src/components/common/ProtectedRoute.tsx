/**
 * Protected Route Component
 * =========================
 * 
 * WHAT THIS COMPONENT DOES:
 * Acts as a "gatekeeper" for pages that require authentication
 * 
 * HOW IT WORKS:
 * 1. Checks if user is logged in
 * 2. If yes → shows the protected content
 * 3. If no → redirects to login page
 * 4. If still checking → shows loading spinner
 * 
 * WHY USERS NEED THIS:
 * Protects their private data (saved ideas, business plans)
 * from being accessed by others!
 * 
 * USAGE:
 * ```tsx
 * <Route 
 *   path="/my-ideas" 
 *   element={
 *     <ProtectedRoute>
 *       <MyIdeasPage />
 *     </ProtectedRoute>
 *   } 
 * />
 * ```
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    /** Optional: Require specific subscription tier */
    requiredTier?: 'pro' | 'enterprise';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredTier
}) => {
    const location = useLocation();
    const { user, token, isLoading, isInitialized, initializeAuth } = useAuthStore();

    // Initialize auth on mount (check if token is still valid)
    useEffect(() => {
        if (!isInitialized && token) {
            initializeAuth();
        }
    }, [isInitialized, token, initializeAuth]);

    // Show loading while checking auth status
    if (!isInitialized || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Checking authentication...</p>
                </motion.div>
            </div>
        );
    }

    // Not logged in → redirect to login
    if (!user || !token) {
        // Save the intended destination so we can redirect after login
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // Check subscription tier if required
    if (requiredTier) {
        const tierLevels = { free: 0, pro: 1, enterprise: 2 };
        const userTierLevel = tierLevels[user.subscriptionTier] || 0;
        const requiredTierLevel = tierLevels[requiredTier];

        if (userTierLevel < requiredTierLevel) {
            // User doesn't have required subscription
            return (
                <div className="min-h-screen flex items-center justify-center bg-black">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md px-4"
                    >
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Upgrade Required
                        </h2>
                        <p className="text-gray-400 mb-6">
                            This feature requires a {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} subscription.
                        </p>
                        <a
                            href="/pricing"
                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 transition-colors"
                        >
                            View Plans
                        </a>
                    </motion.div>
                </div>
            );
        }
    }

    // User is authenticated (and has required tier if specified)
    return <>{children}</>;
};

export default ProtectedRoute;
