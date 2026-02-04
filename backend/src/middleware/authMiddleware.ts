/**
 * Authentication Middleware
 * =========================
 * 
 * WHAT THIS FILE DOES:
 * Acts as a "security guard" for protected API routes:
 * 1. Checks if the request has a valid JWT token
 * 2. If valid → attaches user info to request and lets it through
 * 3. If invalid → blocks the request with 401 Unauthorized
 * 
 * WHY USERS NEED THIS:
 * Protects their business ideas and data from unauthorized access!
 * Without this, anyone could see anyone's saved ideas.
 * 
 * HOW IT'S USED:
 * ```
 * // Protect a route - only logged-in users can access
 * router.get('/my-ideas', authMiddleware, getMyIdeas);
 * ```
 */

import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import logger from './logger';

// Extend Express Request type to include user info
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userEmail?: string;
            userSubscription?: string;
        }
    }
}

/**
 * Authentication Middleware
 * 
 * HOW IT WORKS:
 * 1. Look for token in "Authorization: Bearer <token>" header
 * 2. Verify the token using our secret key
 * 3. If valid, attach user info to request and continue
 * 4. If invalid or missing, return 401 error
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        // Step 1: Get the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                success: false,
                error: 'No authorization token provided',
                code: 'NO_TOKEN',
            });
            return;
        }

        // Step 2: Extract the token (format: "Bearer <token>")
        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).json({
                success: false,
                error: 'Invalid authorization header format. Use: Bearer <token>',
                code: 'INVALID_FORMAT',
            });
            return;
        }

        const token = parts[1];

        // Step 3: Verify the token
        const payload = authService.verifyToken(token);

        if (!payload) {
            res.status(401).json({
                success: false,
                error: 'Invalid or expired token. Please log in again.',
                code: 'INVALID_TOKEN',
            });
            return;
        }

        // Step 4: Attach user info to request for downstream handlers
        req.userId = payload.userId;
        req.userEmail = payload.email;
        req.userSubscription = payload.subscriptionTier;

        logger.debug('Request authenticated', {
            userId: payload.userId,
            path: req.path
        });

        // Step 5: Continue to the next handler
        next();
    } catch (error: any) {
        logger.error('Auth middleware error', { error: error.message });
        res.status(500).json({
            success: false,
            error: 'Authentication error',
            code: 'AUTH_ERROR',
        });
    }
}

/**
 * Optional Authentication Middleware
 * 
 * Like authMiddleware, but doesn't block the request if no token is provided.
 * Useful for routes that work for both logged-in and anonymous users.
 * 
 * Example: Show personalized results if logged in, generic results if not
 */
export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            // No token - that's okay, continue as anonymous
            next();
            return;
        }

        const parts = authHeader.split(' ');

        if (parts.length === 2 && parts[0] === 'Bearer') {
            const token = parts[1];
            const payload = authService.verifyToken(token);

            if (payload) {
                // Valid token - attach user info
                req.userId = payload.userId;
                req.userEmail = payload.email;
                req.userSubscription = payload.subscriptionTier;
            }
        }

        // Continue regardless of auth status
        next();
    } catch (error: any) {
        // Don't fail the request, just continue without user info
        logger.warn('Optional auth middleware error', { error: error.message });
        next();
    }
}

export default {
    authMiddleware,
    optionalAuthMiddleware,
};
