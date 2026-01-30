import mongoose from 'mongoose';
import logger from '../middleware/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexusbiz';

/**
 * MongoDB connection configuration
 */
const mongooseOptions = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    w: 'majority' as const,
};

/**
 * Connect to MongoDB
 */
export const connectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        logger.info('✅ MongoDB connected successfully');

        // Connection event handlers
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error', { error: err });
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });
    } catch (error) {
        logger.error('Failed to connect to MongoDB', { error });
        throw error;
    }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected');
    } catch (error) {
        logger.error('Error disconnecting from MongoDB', { error });
        throw error;
    }
};

/**
 * Check MongoDB connection health
 */
export const checkMongoDBHealth = (): boolean => {
    return mongoose.connection.readyState === 1;
};

export default mongoose;
