/**
 * ME - Vercel Serverless Function
 * ================================
 * 
 * WHAT THIS ENDPOINT DOES:
 * Returns the current logged-in user's profile information
 * 
 * URL: GET /api/auth/me
 * 
 * HEADERS REQUIRED:
 * Authorization: Bearer <jwt_token>
 * 
 * SUCCESS RESPONSE (200):
 * {
 *   "success": true,
 *   "user": { id, email, fullName, subscriptionTier, createdAt }
 * }
 * 
 * WHY USERS NEED THIS:
 * The frontend calls this on page load to check if user is still logged in
 * and to get their current profile data (name, subscription tier, etc.)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { verifyToken } from '../lib/auth';

const log = (msg: string) => console.log(`[Me] ${new Date().toISOString()}: ${msg}`);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: 'No authorization token provided',
                code: 'NO_TOKEN',
            });
        }

        // Extract token (format: "Bearer <token>")
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                success: false,
                error: 'Invalid authorization header format',
                code: 'INVALID_FORMAT',
            });
        }

        const token = parts[1];

        // Verify token
        const payload = verifyToken(token);
        if (!payload) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token',
                code: 'INVALID_TOKEN',
            });
        }

        log(`Getting user: ${payload.userId}`);

        // Fetch user from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                subscriptionTier: true,
                createdAt: true,
                apiRequestsCount: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                subscriptionTier: user.subscriptionTier,
                createdAt: user.createdAt,
                apiRequestsCount: user.apiRequestsCount,
            },
        });
    } catch (error: any) {
        log(`Error: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Failed to get user info',
        });
    }
}
