/**
 * Authentication Controller
 * =========================
 * 
 * WHAT THIS FILE DOES:
 * Handles HTTP requests for authentication:
 * - POST /api/auth/signup → Create new account
 * - POST /api/auth/login → Log in and get token
 * - GET /api/auth/me → Get current user info
 * 
 * WHY USERS NEED THIS:
 * These are the "doors" users knock on to enter the app.
 * Without these endpoints, there's no way to create accounts or log in!
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import userRepository from '../repositories/userRepository';
import authService from '../services/authService';
import logger from '../middleware/logger';

// ===== INPUT VALIDATION SCHEMAS =====
// These ensure users send properly formatted data

const signupSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

/**
 * SIGNUP - Create a new user account
 * 
 * WHAT HAPPENS:
 * 1. User fills out signup form (email, password, name)
 * 2. We validate the input data
 * 3. Check if email already exists
 * 4. Hash the password (so we store it securely)
 * 5. Create the user in database
 * 6. Generate a JWT token
 * 7. Return user info + token
 * 
 * USER BENEFIT: They now have an account and are automatically logged in!
 */
export async function signup(req: Request, res: Response): Promise<void> {
    try {
        // Step 1: Validate input
        const validationResult = signupSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                success: false,
                error: validationResult.error.errors[0].message,
            });
            return;
        }

        const { email, password, fullName } = validationResult.data;

        // Step 2: Validate password strength
        const passwordError = authService.validatePassword(password);
        if (passwordError) {
            res.status(400).json({
                success: false,
                error: passwordError,
            });
            return;
        }

        // Step 3: Check if email already exists
        const existingUser = await userRepository.findUserByEmail(email.toLowerCase());
        if (existingUser) {
            res.status(409).json({
                success: false,
                error: 'An account with this email already exists',
            });
            return;
        }

        // Step 4: Hash the password
        const passwordHash = await authService.hashPassword(password);

        // Step 5: Create user in database
        const user = await userRepository.createUser({
            email: email.toLowerCase(),
            passwordHash,
            fullName,
            subscriptionTier: 'free', // All new users start on free tier
        });

        logger.info('New user registered', { userId: user.id, email: user.email });

        // Step 6: Generate JWT token
        const token = authService.generateToken({
            userId: user.id,
            email: user.email,
            subscriptionTier: user.subscriptionTier,
        });

        // Step 7: Return success response
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                subscriptionTier: user.subscriptionTier,
            },
            token,
            expiresIn: '7d',
        });
    } catch (error: any) {
        logger.error('Signup error', { error: error.message });
        res.status(500).json({
            success: false,
            error: 'Failed to create account. Please try again.',
        });
    }
}

/**
 * LOGIN - Authenticate user and return token
 * 
 * WHAT HAPPENS:
 * 1. User enters email and password
 * 2. We find the user by email
 * 3. Verify the password matches
 * 4. Generate a new JWT token
 * 5. Return user info + token
 * 
 * USER BENEFIT: They can access their saved ideas and history!
 */
export async function login(req: Request, res: Response): Promise<void> {
    try {
        // Step 1: Validate input
        const validationResult = loginSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                success: false,
                error: validationResult.error.errors[0].message,
            });
            return;
        }

        const { email, password } = validationResult.data;

        // Step 2: Find user by email
        const user = await userRepository.findUserByEmail(email.toLowerCase());
        if (!user) {
            // Don't reveal whether email exists or not (security)
            res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
            return;
        }

        // Step 3: Verify password
        const isPasswordValid = await authService.verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
            logger.warn('Failed login attempt', { email: email.toLowerCase() });
            res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
            return;
        }

        logger.info('User logged in', { userId: user.id, email: user.email });

        // Step 4: Generate JWT token
        const token = authService.generateToken({
            userId: user.id,
            email: user.email,
            subscriptionTier: user.subscriptionTier,
        });

        // Step 5: Return success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                subscriptionTier: user.subscriptionTier,
            },
            token,
            expiresIn: '7d',
        });
    } catch (error: any) {
        logger.error('Login error', { error: error.message });
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.',
        });
    }
}

/**
 * ME - Get current user info
 * 
 * WHAT HAPPENS:
 * 1. User sends request with JWT token in header
 * 2. Middleware verifies the token and attaches user ID
 * 3. We fetch full user info from database
 * 4. Return user profile
 * 
 * USER BENEFIT: App can show their name, subscription status, etc.
 * 
 * NOTE: This endpoint requires authentication (authMiddleware)
 */
export async function me(req: Request, res: Response): Promise<void> {
    try {
        // The userId is attached by authMiddleware
        const userId = (req as any).userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                error: 'Not authenticated',
            });
            return;
        }

        // Fetch user from database
        const user = await userRepository.findUserById(userId);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }

        // Return user info
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                subscriptionTier: user.subscriptionTier,
                createdAt: user.createdAt,
            },
        });
    } catch (error: any) {
        logger.error('Get user error', { error: error.message });
        res.status(500).json({
            success: false,
            error: 'Failed to get user info',
        });
    }
}

export default {
    signup,
    login,
    me,
};
