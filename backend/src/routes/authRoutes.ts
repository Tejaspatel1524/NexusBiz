/**
 * Authentication Routes
 * =====================
 * 
 * WHAT THIS FILE DOES:
 * Connects URL paths to controller functions:
 * 
 * Public routes (no login required):
 * - POST /api/auth/signup → Create new account
 * - POST /api/auth/login → Log in and get token
 * 
 * Protected routes (login required):
 * - GET /api/auth/me → Get current user info
 * 
 * WHY USERS NEED THIS:
 * This is the "address book" - it tells the server which 
 * function to run when users visit each URL.
 */

import { Router } from 'express';
import authController from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * POST /api/auth/signup
 * 
 * Creates a new user account
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123",
 *   "fullName": "John Doe"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "user": { id, email, fullName, subscriptionTier },
 *   "token": "jwt_token_here",
 *   "expiresIn": "7d"
 * }
 */
router.post('/signup', authController.signup);

/**
 * POST /api/auth/login
 * 
 * Authenticates user and returns JWT token
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "user": { id, email, fullName, subscriptionTier },
 *   "token": "jwt_token_here",
 *   "expiresIn": "7d"
 * }
 */
router.post('/login', authController.login);

/**
 * GET /api/auth/me
 * 
 * Returns current logged-in user's profile
 * Requires valid JWT token in Authorization header
 * 
 * Headers:
 * Authorization: Bearer <jwt_token>
 * 
 * Response:
 * {
 *   "success": true,
 *   "user": { id, email, fullName, subscriptionTier, createdAt }
 * }
 */
router.get('/me', authMiddleware, authController.me);

export default router;
