import prisma from '../config/prisma';
import { BusinessPlanContent, IBusinessPlanContent } from '../models/businessPlanContent.model';
import { BusinessPlan, GenerationStatus, Prisma } from '@prisma/client';
import logger from '../middleware/logger';

/**
 * Repository for BusinessPlan operations
 */
export class BusinessPlanRepository {
    /**
     * Create a new business plan
     */
    async createBusinessPlan(
        data: Prisma.BusinessPlanCreateInput
    ): Promise<BusinessPlan> {
        try {
            const plan = await prisma.businessPlan.create({
                data,
                include: {
                    idea: true,
                    user: true,
                },
            });
            logger.info('Created new business plan', { planId: plan.id });
            return plan;
        } catch (error) {
            logger.error('Error creating business plan', { error });
            throw error;
        }
    }

    /**
     * Find business plan by ID
     */
    async findBusinessPlanById(id: string): Promise<BusinessPlan | null> {
        try {
            return await prisma.businessPlan.findUnique({
                where: { id },
                include: {
                    idea: true,
                    user: true,
                },
            });
        } catch (error) {
            logger.error('Error finding business plan by ID', { planId: id, error });
            throw error;
        }
    }

    /**
     * Find business plan by idea ID
     */
    async findBusinessPlanByIdeaId(ideaId: string): Promise<BusinessPlan | null> {
        try {
            return await prisma.businessPlan.findUnique({
                where: { ideaId },
                include: {
                    idea: true,
                },
            });
        } catch (error) {
            logger.error('Error finding business plan by idea ID', { ideaId, error });
            throw error;
        }
    }

    /**
     * Update generation status
     */
    async updateGenerationStatus(
        id: string,
        status: GenerationStatus,
        additionalData?: {
            totalTokensUsed?: number;
            generationTimeSeconds?: number;
        }
    ): Promise<BusinessPlan> {
        try {
            return await prisma.businessPlan.update({
                where: { id },
                data: {
                    generationStatus: status,
                    ...additionalData,
                },
            });
        } catch (error) {
            logger.error('Error updating generation status', { planId: id, error });
            throw error;
        }
    }

    /**
     * Update sections completed
     */
    async updateSectionsCompleted(
        id: string,
        sections: Record<string, boolean>
    ): Promise<BusinessPlan> {
        try {
            return await prisma.businessPlan.update({
                where: { id },
                data: {
                    sectionsCompleted: sections as any,
                },
            });
        } catch (error) {
            logger.error('Error updating sections completed', { planId: id, error });
            throw error;
        }
    }

    /**
     * Save business plan content to MongoDB
     */
    async saveBusinessPlanContent(
        businessPlanId: string,
        ideaId: string,
        content: Partial<IBusinessPlanContent>
    ): Promise<IBusinessPlanContent> {
        try {
            // Check if content already exists
            let planContent = await BusinessPlanContent.findOne({ businessPlanId });

            if (planContent) {
                // Update existing
                Object.assign(planContent, content);
                planContent.metadata.version += 1;
                await planContent.save();
                logger.info('Updated business plan content', { businessPlanId });
            } else {
                // Create new
                planContent = new BusinessPlanContent({
                    businessPlanId,
                    ideaId,
                    ...content,
                });
                await planContent.save();
                logger.info('Created business plan content', { businessPlanId });

                // Update PostgreSQL with MongoDB ID
                await prisma.businessPlan.update({
                    where: { id: businessPlanId },
                    data: { mongodbContentId: planContent._id.toString() },
                });
            }

            return planContent;
        } catch (error) {
            logger.error('Error saving business plan content', { businessPlanId, error });
            throw error;
        }
    }

    /**
     * Get business plan content from MongoDB
     */
    async getBusinessPlanContent(
        businessPlanId: string
    ): Promise<IBusinessPlanContent | null> {
        try {
            return await BusinessPlanContent.findOne({ businessPlanId });
        } catch (error) {
            logger.error('Error getting business plan content', { businessPlanId, error });
            throw error;
        }
    }

    /**
     * Update a specific section of business plan content
     */
    async updateSection(
        businessPlanId: string,
        sectionName: string,
        content: any
    ): Promise<IBusinessPlanContent | null> {
        try {
            const updateData: any = {
                [sectionName]: {
                    ...content,
                    generatedAt: new Date(),
                },
            };

            // Increment version
            updateData['metadata.sectionsRegenerated'] = sectionName;
            updateData['metadata.version'] = { $inc: 1 };

            const planContent = await BusinessPlanContent.findOneAndUpdate(
                { businessPlanId },
                {
                    $set: updateData,
                    $addToSet: { 'metadata.sectionsRegenerated': sectionName },
                },
                { new: true }
            );

            logger.info('Updated business plan section', { businessPlanId, sectionName });
            return planContent;
        } catch (error) {
            logger.error('Error updating business plan section', {
                businessPlanId,
                sectionName,
                error,
            });
            throw error;
        }
    }

    /**
     * Update PDF export info
     */
    async updatePdfExport(id: string, pdfUrl: string): Promise<BusinessPlan> {
        try {
            return await prisma.businessPlan.update({
                where: { id },
                data: {
                    exportedPdfUrl: pdfUrl,
                    lastExportedAt: new Date(),
                },
            });
        } catch (error) {
            logger.error('Error updating PDF export info', { planId: id, error });
            throw error;
        }
    }

    /**
     * Get business plans by user
     */
    async getBusinessPlansByUser(userId: string): Promise<BusinessPlan[]> {
        try {
            return await prisma.businessPlan.findMany({
                where: { userId },
                include: {
                    idea: {
                        select: {
                            title: true,
                            industry: true,
                            difficultyScore: true,
                            viabilityScore: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            logger.error('Error getting business plans by user', { userId, error });
            throw error;
        }
    }

    /**
     * Delete business plan content from MongoDB
     */
    async deleteBusinessPlanContent(businessPlanId: string): Promise<void> {
        try {
            await BusinessPlanContent.deleteOne({ businessPlanId });
            logger.info('Deleted business plan content', { businessPlanId });
        } catch (error) {
            logger.error('Error deleting business plan content', { businessPlanId, error });
            throw error;
        }
    }
}

export default new BusinessPlanRepository();
