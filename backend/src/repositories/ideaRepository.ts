import prisma from '../config/prisma';
import { Idea, IdeaStatus, Prisma } from '@prisma/client';
import logger from '../middleware/logger';

/**
 * Repository for Idea operations
 */
export class IdeaRepository {
    /**
     * Create a new idea
     */
    async createIdea(data: Prisma.IdeaCreateInput): Promise<Idea> {
        try {
            const idea = await prisma.idea.create({
                data,
                include: {
                    user: true,
                },
            });
            logger.info('Created new idea', { ideaId: idea.id });
            return idea;
        } catch (error) {
            logger.error('Error creating idea', { error });
            throw error;
        }
    }

    /**
     * Find idea by ID
     */
    async findIdeaById(id: string): Promise<Idea | null> {
        try {
            return await prisma.idea.findUnique({
                where: { id },
                include: {
                    user: true,
                    businessPlan: true,
                },
            });
        } catch (error) {
            logger.error('Error finding idea by ID', { ideaId: id, error });
            throw error;
        }
    }

    /**
     * Find ideas by user with filters
     */
    async findIdeasByUser(
        userId: string,
        filters?: {
            status?: IdeaStatus;
            industry?: string;
            limit?: number;
            offset?: number;
        }
    ): Promise<{ ideas: Idea[]; total: number }> {
        try {
            const where: Prisma.IdeaWhereInput = {
                userId,
                ...(filters?.status && { status: filters.status }),
                ...(filters?.industry && { industry: filters.industry }),
            };

            const [ideas, total] = await Promise.all([
                prisma.idea.findMany({
                    where,
                    include: {
                        businessPlan: {
                            select: {
                                id: true,
                                generationStatus: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: filters?.limit || 20,
                    skip: filters?.offset || 0,
                }),
                prisma.idea.count({ where }),
            ]);

            return { ideas, total };
        } catch (error) {
            logger.error('Error finding ideas by user', { userId, error });
            throw error;
        }
    }

    /**
     * Get all ideas (for anonymous users or admin)
     */
    async findAllIdeas(filters?: {
        status?: IdeaStatus;
        industry?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ ideas: Idea[]; total: number }> {
        try {
            const where: Prisma.IdeaWhereInput = {
                ...(filters?.status && { status: filters.status }),
                ...(filters?.industry && { industry: filters.industry }),
            };

            const [ideas, total] = await Promise.all([
                prisma.idea.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    take: filters?.limit || 20,
                    skip: filters?.offset || 0,
                }),
                prisma.idea.count({ where }),
            ]);

            return { ideas, total };
        } catch (error) {
            logger.error('Error finding all ideas', { error });
            throw error;
        }
    }

    /**
     * Update idea
     */
    async updateIdea(id: string, data: Prisma.IdeaUpdateInput): Promise<Idea> {
        try {
            const idea = await prisma.idea.update({
                where: { id },
                data,
            });
            logger.info('Updated idea', { ideaId: id });
            return idea;
        } catch (error) {
            logger.error('Error updating idea', { ideaId: id, error });
            throw error;
        }
    }

    /**
     * Delete idea (soft delete by setting status to archived)
     */
    async deleteIdea(id: string): Promise<Idea> {
        try {
            const idea = await prisma.idea.update({
                where: { id },
                data: { status: 'archived' },
            });
            logger.info('Archived idea', { ideaId: id });
            return idea;
        } catch (error) {
            logger.error('Error archiving idea', { ideaId: id, error });
            throw error;
        }
    }

    /**
     * Hard delete idea
     */
    async hardDeleteIdea(id: string): Promise<void> {
        try {
            await prisma.idea.delete({
                where: { id },
            });
            logger.info('Hard deleted idea', { ideaId: id });
        } catch (error) {
            logger.error('Error hard deleting idea', { ideaId: id, error });
            throw error;
        }
    }

    /**
     * Increment view count
     */
    async incrementViewCount(id: string): Promise<Idea> {
        try {
            return await prisma.idea.update({
                where: { id },
                data: {
                    viewCount: {
                        increment: 1,
                    },
                },
            });
        } catch (error) {
            logger.error('Error incrementing view count', { ideaId: id, error });
            throw error;
        }
    }

    /**
     * Get favorite ideas for a user
     */
    async getFavoriteIdeas(userId: string): Promise<Idea[]> {
        try {
            return await prisma.idea.findMany({
                where: {
                    userId,
                    status: 'favorite',
                },
                orderBy: { updatedAt: 'desc' },
            });
        } catch (error) {
            logger.error('Error getting favorite ideas', { userId, error });
            throw error;
        }
    }

    /**
     * Mark idea as favorite
     */
    async markAsFavorite(id: string): Promise<Idea> {
        try {
            return await prisma.idea.update({
                where: { id },
                data: { status: 'favorite' },
            });
        } catch (error) {
            logger.error('Error marking idea as favorite', { ideaId: id, error });
            throw error;
        }
    }

    /**
     * Get ideas by industry
     */
    async getIdeasByIndustry(
        industry: string,
        limit: number = 10
    ): Promise<Idea[]> {
        try {
            return await prisma.idea.findMany({
                where: {
                    industry,
                    status: { not: 'archived' },
                },
                orderBy: [{ viabilityScore: 'desc' }, { createdAt: 'desc' }],
                take: limit,
            });
        } catch (error) {
            logger.error('Error getting ideas by industry', { industry, error });
            throw error;
        }
    }

    /**
     * Get trending ideas (high viability, recently created)
     */
    async getTrendingIdeas(limit: number = 10): Promise<Idea[]> {
        try {
            return await prisma.idea.findMany({
                where: {
                    status: { not: 'archived' },
                    viabilityScore: { gte: 70 },
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                    },
                },
                orderBy: [{ viabilityScore: 'desc' }, { viewCount: 'desc' }],
                take: limit,
            });
        } catch (error) {
            logger.error('Error getting trending ideas', { error });
            throw error;
        }
    }
}

export default new IdeaRepository();
