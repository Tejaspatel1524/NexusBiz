/**
 * Prisma Client for Vercel Serverless Functions
 * ==============================================
 * 
 * WHAT THIS FILE DOES:
 * Creates a single Prisma client instance that's reused across serverless function invocations.
 * This prevents creating too many database connections.
 * 
 * WHY THIS IS NEEDED:
 * Serverless functions can be called many times rapidly.
 * Without connection pooling, each call would create a new database connection,
 * which would quickly exhaust the connection limit.
 */

import { PrismaClient } from '@prisma/client';

// Declare global type for Prisma client (prevents multiple instances in dev)
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Use existing client or create new one
const prisma = globalThis.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// In development, save to global to prevent multiple instances during hot reload
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

export default prisma;
