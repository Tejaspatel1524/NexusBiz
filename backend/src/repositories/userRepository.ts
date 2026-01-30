import prisma from '../config/prisma';
import { User, Prisma } from '@prisma/client';
import logger from '../middleware/logger';

/**
 * Repository for User operations
 */
export class UserRepository {
    /**
     * Create a new user
     */
    async createUser(
        data: Prisma.UserCreateInput
    ): Promise<Omit<User, 'passwordHash'>> {
        try {
            const user = await prisma.user.create({
                data,
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    createdAt: true,
                    updatedAt: true,
                    subscriptionTier: true,
                    apiRequestsCount: true,
                    lastRequestAt: true,
                    passwordHash: false,
                },
            });
            logger.info('Created new user', { userId: user.id, email: user.email });
            return user;
        } catch (error) {
            logger.error('Error creating user', { error });
            throw error;
        }
    }

    /**
     * Find user by email
     */
    async findUserByEmail(email: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { email },
            });
        } catch (error) {
            logger.error('Error finding user by email', { email, error });
            throw error;
        }
    }

    /**
     * Find user by ID
     */
    async findUserById(
        id: string
    ): Promise<Omit<User, 'passwordHash'> | null> {
        try {
            return await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    createdAt: true,
                    updatedAt: true,
                    subscriptionTier: true,
                    apiRequestsCount: true,
                    lastRequestAt: true,
                    passwordHash: false,
                },
            });
        } catch (error) {
            logger.error('Error finding user by ID', { userId: id, error });
            throw error;
        }
    }

    /**
     * Update user
     */
    async updateUser(
        id: string,
        data: Prisma.UserUpdateInput
    ): Promise<Omit<User, 'passwordHash'>> {
        try {
            const user = await prisma.user.update({
                where: { id },
                data,
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    createdAt: true,
                    updatedAt: true,
                    subscriptionTier: true,
                    apiRequestsCount: true,
                    lastRequestAt: true,
                    passwordHash: false,
                },
            });
            logger.info('Updated user', { userId: id });
            return user;
        } catch (error) {
            logger.error('Error updating user', { userId: id, error });
            throw error;
        }
    }

    /**
     * Increment API request count
     */
    async incrementRequestCount(id: string): Promise<void> {
        try {
            await prisma.user.update({
                where: { id },
                data: {
                    apiRequestsCount: { increment: 1 },
                    lastRequestAt: new Date(),
                },
            });
        } catch (error) {
            logger.error('Error incrementing request count', { userId: id, error });
            throw error;
        }
    }

    /**
     * Get user statistics
     */
    async getUserStatistics(userId: string): Promise<{
        totalIdeas: number;
        totalBusinessPlans: number;
        favoriteIdeas: number;
        apiRequestsCount: number;
    }> {
        try {
            const [user, totalIdeas, totalBusinessPlans, favoriteIdeas] =
                await Promise.all([
                    prisma.user.findUnique({
                        where: { id: userId },
                        select: { apiRequestsCount: true },
                    }),
                    prisma.idea.count({ where: { userId } }),
                    prisma.businessPlan.count({ where: { userId } }),
                    prisma.idea.count({ where: { userId, status: 'favorite' } }),
                ]);

            return {
                totalIdeas,
                totalBusinessPlans,
                favoriteIdeas,
                apiRequestsCount: user?.apiRequestsCount || 0,
            };
        } catch (error) {
            logger.error('Error getting user statistics', { userId, error });
            throw error;
        }
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<void> {
        try {
            await prisma.user.delete({
                where: { id },
            });
            logger.info('Deleted user', { userId: id });
        } catch (error) {
            logger.error('Error deleting user', { userId: id, error });
            throw error;
        }
    }
}

export default new UserRepository();
