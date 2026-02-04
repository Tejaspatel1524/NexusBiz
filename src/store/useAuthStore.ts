/**
 * Authentication Store (Zustand)
 * ===============================
 * 
 * WHAT THIS FILE DOES:
 * Manages authentication state for the entire app:
 * - Stores current user info (name, email, subscription tier)
 * - Stores JWT token for API requests
 * - Provides login, signup, logout functions
 * - Persists token to localStorage (stay logged in after refresh)
 * 
 * WHY USERS NEED THIS:
 * - They stay logged in even after closing the browser
 * - Their data is preserved across sessions
 * - They can access saved ideas from any page
 * 
 * HOW IT WORKS:
 * 1. On app load, check localStorage for existing token
 * 2. If found, validate token by calling /api/auth/me
 * 3. If valid, set user as logged in
 * 4. If invalid/expired, clear token and show login
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User type that matches our backend response
export interface User {
    id: string;
    email: string;
    fullName: string;
    subscriptionTier: 'free' | 'pro' | 'enterprise';
    createdAt?: string;
}

// Auth state shape
interface AuthState {
    // State
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, fullName: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
    initializeAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
}

// API base URL
const API_BASE_URL = '/api';

/**
 * Auth Store - manages all authentication state
 * 
 * Uses Zustand with persist middleware to save token to localStorage
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            token: null,
            isLoading: false,
            isInitialized: false,
            error: null,

            /**
             * LOGIN - Authenticate user with email and password
             * 
             * WHAT IT DOES:
             * 1. Sends credentials to backend
             * 2. Receives JWT token and user info
             * 3. Stores in state and localStorage
             * 4. User is now logged in!
             */
            login: async (email: string, password: string): Promise<boolean> => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        set({
                            error: data.error || 'Login failed',
                            isLoading: false
                        });
                        return false;
                    }

                    // Success! Store user and token
                    set({
                        user: data.user,
                        token: data.token,
                        isLoading: false,
                        error: null,
                    });

                    console.log('Login successful:', data.user.email);
                    return true;
                } catch (error: any) {
                    set({
                        error: error.message || 'Network error',
                        isLoading: false
                    });
                    return false;
                }
            },

            /**
             * SIGNUP - Create new user account
             * 
             * WHAT IT DOES:
             * 1. Sends registration data to backend
             * 2. Creates new user in database
             * 3. Returns JWT token (auto-login after signup)
             * 4. User is now logged in!
             */
            signup: async (email: string, password: string, fullName: string): Promise<boolean> => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password, fullName }),
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        set({
                            error: data.error || 'Signup failed',
                            isLoading: false
                        });
                        return false;
                    }

                    // Success! Store user and token (auto-login)
                    set({
                        user: data.user,
                        token: data.token,
                        isLoading: false,
                        error: null,
                    });

                    console.log('Signup successful:', data.user.email);
                    return true;
                } catch (error: any) {
                    set({
                        error: error.message || 'Network error',
                        isLoading: false
                    });
                    return false;
                }
            },

            /**
             * LOGOUT - Clear user session
             * 
             * WHAT IT DOES:
             * 1. Clears user and token from state
             * 2. Clears localStorage
             * 3. User must log in again to access protected pages
             */
            logout: () => {
                set({
                    user: null,
                    token: null,
                    error: null
                });
                // Clear from localStorage explicitly
                localStorage.removeItem('nexusbiz-auth');
                console.log('User logged out');
            },

            /**
             * INITIALIZE AUTH - Check if user is still logged in
             * 
             * WHAT IT DOES:
             * Called on app startup to:
             * 1. Check if there's a stored token
             * 2. Validate it by calling /api/auth/me
             * 3. If valid, restore user session
             * 4. If invalid, clear and redirect to login
             */
            initializeAuth: async () => {
                const { token } = get();

                if (!token) {
                    set({ isInitialized: true });
                    return;
                }

                set({ isLoading: true });

                try {
                    const response = await fetch(`${API_BASE_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        // Token is valid, restore session
                        set({
                            user: data.user,
                            isLoading: false,
                            isInitialized: true,
                        });
                        console.log('Auth restored:', data.user.email);
                    } else {
                        // Token is invalid/expired, clear it
                        set({
                            user: null,
                            token: null,
                            isLoading: false,
                            isInitialized: true,
                        });
                        localStorage.removeItem('nexusbiz-auth');
                        console.log('Token expired, cleared auth');
                    }
                } catch {
                    // Network error, clear auth to be safe
                    set({
                        user: null,
                        token: null,
                        isLoading: false,
                        isInitialized: true,
                    });
                }
            },

            clearError: () => set({ error: null }),
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
        }),
        {
            name: 'nexusbiz-auth', // localStorage key
            partialize: (state) => ({
                token: state.token,
                // Don't persist user - we'll fetch from /me on init
            }),
        }
    )
);

/**
 * Helper hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
    const { user, token } = useAuthStore();
    return !!(user && token);
};

/**
 * Helper hook to get auth token for API calls
 */
export const useAuthToken = () => {
    const { token } = useAuthStore();
    return token;
};

export default useAuthStore;
