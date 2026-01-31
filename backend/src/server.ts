// Load environment variables FIRST - must be before any other imports
// that might use process.env values
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import logger from './middleware/logger';

const PORT = process.env.PORT || 5000;

/**
 * Start the server
 */
const startServer = (): void => {
    try {
        app.listen(PORT, () => {
            logger.info(`🚀 NexusBiz API Server is running on port ${PORT}`);
            logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
            logger.info(`💡 Generate ideas: POST http://localhost:${PORT}/api/ideas/generate`);
            logger.info(`📋 Generate plan: POST http://localhost:${PORT}/api/business-plan/generate`);
        });
    } catch (error) {
        logger.error('Failed to start server', { error });
        process.exit(1);
    }
};

// Handle unhandled rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', { promise, reason });
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

startServer();
