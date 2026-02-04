/**
 * LOGIN - Vercel Serverless Function
 * ===================================
 * 
 * WHAT THIS ENDPOINT DOES:
 * Authenticates a user and returns a JWT token
 * 
 * URL: POST /api/auth/login
 * 
 * REQUEST BODY:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123"
 * }
 * 
 * SUCCESS RESPONSE (200):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "user": { id, email, fullName, subscriptionTier },
 *   "token": "jwt_token_here",
 *   "expiresIn": "7d"
 * }
 * 
 * WHY USERS NEED THIS:
 * This is how they log in to access their saved ideas and history!
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { verifyPassword, generateToken, validateEmail } from '../lib/auth';

const log = (msg: string) => console.log(`[Login] ${new Date().toISOString()}: ${msg}`);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body || {};

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required',
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
            });
        }

        log(`Login attempt for: ${email}`);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            // Don't reveal whether email exists (security best practice)
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.passwordHash);

        if (!isPasswordValid) {
            log(`Failed login for: ${email}`);
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
        }

        log(`Successful login: ${user.id}`);

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            subscriptionTier: user.subscriptionTier,
        });

        return res.status(200).json({
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
        log(`Error: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.',
        });
    }
}
