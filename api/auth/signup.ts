/**
 * SIGNUP - Vercel Serverless Function
 * ====================================
 * 
 * WHAT THIS ENDPOINT DOES:
 * Creates a new user account in the database
 * 
 * URL: POST /api/auth/signup
 * 
 * REQUEST BODY:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123",
 *   "fullName": "John Doe"
 * }
 * 
 * SUCCESS RESPONSE (201):
 * {
 *   "success": true,
 *   "message": "Account created successfully",
 *   "user": { id, email, fullName, subscriptionTier },
 *   "token": "jwt_token_here",
 *   "expiresIn": "7d"
 * }
 * 
 * WHY USERS NEED THIS:
 * This is how they create their account! Without this, no one can sign up.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { hashPassword, generateToken, validatePassword, validateEmail } from '../lib/auth';

const log = (msg: string) => console.log(`[Signup] ${new Date().toISOString()}: ${msg}`);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { email, password, fullName } = req.body || {};

        // Validate required fields
        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                error: 'Email, password, and full name are required',
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
            });
        }

        // Validate password strength
        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({
                success: false,
                error: passwordError,
            });
        }

        // Validate name length
        if (fullName.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Name must be at least 2 characters',
            });
        }

        log(`Signup attempt for: ${email}`);

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'An account with this email already exists',
            });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                passwordHash,
                fullName,
                subscriptionTier: 'free',
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                subscriptionTier: true,
                createdAt: true,
            },
        });

        log(`User created: ${user.id}`);

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            subscriptionTier: user.subscriptionTier,
        });

        return res.status(201).json({
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
        log(`Error: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Failed to create account. Please try again.',
        });
    }
}
