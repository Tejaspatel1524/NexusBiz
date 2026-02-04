/**
 * Authentication Service
 * =====================
 * 
 * WHAT THIS FILE DOES:
 * - Hashes passwords so we never store them in plain text
 * - Generates JWT tokens (user's "digital access card")
 * - Verifies JWT tokens to authenticate requests
 * 
 * WHY USERS NEED THIS:
 * - Keeps their passwords secure (even if database is hacked)
 * - Lets them stay logged in across sessions
 * - Protects their business ideas from unauthorized access
 */

import jwt from 'jsonwebtoken';
import logger from '../middleware/logger';

// We'll use a simple hash for now - in production you'd use bcryptjs
// Installing bcryptjs: npm install bcryptjs @types/bcryptjs

const JWT_SECRET = process.env.JWT_SECRET || 'nexusbiz-super-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // Token valid for 7 days

// User payload that gets stored in the JWT token
export interface JWTPayload {
    userId: string;
    email: string;
    subscriptionTier: string;
}

// Response when user logs in or signs up
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        fullName: string;
        subscriptionTier: string;
    };
    token: string;
    expiresIn: string;
}

/**
 * Hash a password using a simple but secure method
 * 
 * HOW IT WORKS:
 * Takes "MyPassword123" and turns it into something like:
 * "$SHA256$randomsalt$hashedvalue..."
 * 
 * This way, even if someone steals the database, they can't see passwords!
 */
export async function hashPassword(password: string): Promise<string> {
    // Using Node's built-in crypto for basic hashing
    // For production, you should use bcryptjs which is more secure
    const crypto = await import('crypto');

    // Create a random "salt" - adds randomness so same password = different hash
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash the password with the salt
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    // Store salt + hash together (we need salt to verify later)
    return `${salt}:${hash}`;
}

/**
 * Verify if a password matches its hash
 * 
 * HOW IT WORKS:
 * 1. Takes the user's input: "MyPassword123"
 * 2. Takes the stored hash: "salt:hashedvalue"
 * 3. Re-hashes the input with the same salt
 * 4. Compares - if they match, password is correct!
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const crypto = await import('crypto');

    // Split the stored hash into salt and hash parts
    const [salt, originalHash] = storedHash.split(':');

    if (!salt || !originalHash) {
        logger.error('Invalid password hash format');
        return false;
    }

    // Re-hash the input password with the same salt
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    // Compare the hashes
    return hash === originalHash;
}

/**
 * Generate a JWT token for a user
 * 
 * HOW IT WORKS:
 * Creates a signed "access pass" containing:
 * - User's ID
 * - User's email
 * - Subscription tier
 * - Expiration time (7 days by default)
 * 
 * The token is signed with our secret key, so no one can fake it!
 */
export function generateToken(payload: JWTPayload): string {
    logger.info('Generating JWT token', { userId: payload.userId, email: payload.email });

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

/**
 * Verify a JWT token and extract user info
 * 
 * HOW IT WORKS:
 * 1. Takes the token from the request header
 * 2. Verifies it was signed with our secret key
 * 3. Checks it hasn't expired
 * 4. Returns the user info stored in the token
 * 
 * If anything is wrong, returns null (unauthorized!)
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            logger.warn('JWT token expired');
        } else if (error.name === 'JsonWebTokenError') {
            logger.warn('Invalid JWT token');
        } else {
            logger.error('JWT verification error', { error: error.message });
        }
        return null;
    }
}

/**
 * Validate password strength
 * 
 * RULES:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * 
 * Returns error message if invalid, null if valid
 */
export function validatePassword(password: string): string | null {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null; // Password is valid
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
    validatePassword,
    validateEmail,
};
