import { PrismaClient } from '@prisma/client';
import logger from '../middleware/logger';

/**
 * Prisma Client configuration
 */
const prisma = new PrismaClient({
    log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
    ],
});

// Log queries in development
if (process.env.NODE_ENV === 'development') {
    prisma.$on('query' as any, (e: any) => {
        logger.debug('Prisma Query', {
            query: e.query,
            params: e.params,
            duration: e.duration,
        });
    });
}

// Log errors
prisma.$on('error' as any, (e: any) => {
    logger.error('Prisma Error', { error: e });
});

// Log warnings
prisma.$on('warn' as any, (e: any) => {
    logger.warn('Prisma Warning', { message: e.message });
});

/**
 * Connect to PostgreSQL
 */
export const connectPostgreSQL = async (): Promise<void> => {
    try {
        await prisma.$connect();
        logger.info('✅ PostgreSQL connected successfully');
    } catch (error) {
        logger.error('Failed to connect to PostgreSQL', { error });
        throw error;
    }
};

/**
 * Disconnect from PostgreSQL
 */
export const disconnectPostgreSQL = async (): Promise<void> => {
    try {
        await prisma.$disconnect();
        logger.info('PostgreSQL disconnected');
    } catch (error) {
        logger.error('Error disconnecting from PostgreSQL', { error });
        throw error;
    }
};

/**
 * Check PostgreSQL connection health
 */
export const checkPostgreSQLHealth = async (): Promise<boolean> => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        logger.error('PostgreSQL health check failed', { error });
        return false;
    }
};

export default prisma;
