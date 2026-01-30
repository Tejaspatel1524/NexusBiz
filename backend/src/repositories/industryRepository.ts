import prisma from '../config/prisma';
import { Industry, Prisma } from '@prisma/client';
import logger from '../middleware/logger';

/**
 * Repository for Industry operations
 */
export class IndustryRepository {
    /**
     * Get all industries
     */
    async getAllIndustries(activeOnly: boolean = true): Promise<Industry[]> {
        try {
            return await prisma.industry.findMany({
                where: activeOnly ? { isActive: true } : {},
                orderBy: { name: 'asc' },
            });
        } catch (error) {
            logger.error('Error getting all industries', { error });
            throw error;
        }
    }

    /**
     * Get industry by slug
     */
    async getIndustryBySlug(slug: string): Promise<Industry | null> {
        try {
            return await prisma.industry.findUnique({
                where: { slug },
            });
        } catch (error) {
            logger.error('Error getting industry by slug', { slug, error });
            throw error;
        }
    }

    /**
     * Get industry by name
     */
    async getIndustryByName(name: string): Promise<Industry | null> {
        try {
            return await prisma.industry.findUnique({
                where: { name },
            });
        } catch (error) {
            logger.error('Error getting industry by name', { name, error });
            throw error;
        }
    }

    /**
     * Get trending industries
     */
    async getTrendingIndustries(limit: number = 10): Promise<Industry[]> {
        try {
            return await prisma.industry.findMany({
                where: { isActive: true },
                orderBy: { trendingScore: 'desc' },
                take: limit,
            });
        } catch (error) {
            logger.error('Error getting trending industries', { error });
            throw error;
        }
    }

    /**
     * Create industry
     */
    async createIndustry(data: Prisma.IndustryCreateInput): Promise<Industry> {
        try {
            const industry = await prisma.industry.create({
                data,
            });
            logger.info('Created new industry', { industryId: industry.id });
            return industry;
        } catch (error) {
            logger.error('Error creating industry', { error });
            throw error;
        }
    }

    /**
     * Update industry
     */
    async updateIndustry(
        id: string,
        data: Prisma.IndustryUpdateInput
    ): Promise<Industry> {
        try {
            return await prisma.industry.update({
                where: { id },
                data,
            });
        } catch (error) {
            logger.error('Error updating industry', { industryId: id, error });
            throw error;
        }
    }

    /**
     * Update trending score
     */
    async updateTrendingScore(id: string, score: number): Promise<Industry> {
        try {
            return await prisma.industry.update({
                where: { id },
                data: { trendingScore: score },
            });
        } catch (error) {
            logger.error('Error updating trending score', { industryId: id, error });
            throw error;
        }
    }

    /**
     * Delete industry
     */
    async deleteIndustry(id: string): Promise<void> {
        try {
            await prisma.industry.delete({
                where: { id },
            });
            logger.info('Deleted industry', { industryId: id });
        } catch (error) {
            logger.error('Error deleting industry', { industryId: id, error });
            throw error;
        }
    }

    /**
     * Deactivate industry (soft delete)
     */
    async deactivateIndustry(id: string): Promise<Industry> {
        try {
            return await prisma.industry.update({
                where: { id },
                data: { isActive: false },
            });
        } catch (error) {
            logger.error('Error deactivating industry', { industryId: id, error });
            throw error;
        }
    }
}

export default new IndustryRepository();
