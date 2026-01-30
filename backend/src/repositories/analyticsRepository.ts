import prisma from '../config/prisma';
import { Analytics, EventType, Prisma } from '@prisma/client';
import logger from '../middleware/logger';

/**
 * Repository for Analytics operations
 */
export class AnalyticsRepository {
    /**
     * Log an analytics event
     */
    async logEvent(
        eventType: EventType,
        data: {
            userId?: string;
            ideaId?: string;
            businessPlanId?: string;
            metadata?: Record<string, any>;
            ipAddress?: string;
            userAgent?: string;
        }
    ): Promise<Analytics> {
        try {
            const event = await prisma.analytics.create({
                data: {
                    eventType,
                    userId: data.userId,
                    ideaId: data.ideaId,
                    businessPlanId: data.businessPlanId,
                    metadata: data.metadata as any,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                },
            });
            logger.debug('Logged analytics event', { eventType, eventId: event.id });
            return event;
        } catch (error) {
            logger.error('Error logging analytics event', { eventType, error });
            throw error;
        }
    }

    /**
     * Get analytics by filters
     */
    async getAnalytics(filters?: {
        eventType?: EventType;
        userId?: string;
        ideaId?: string;
        businessPlanId?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{ events: Analytics[]; total: number }> {
        try {
            const where: Prisma.AnalyticsWhereInput = {
                ...(filters?.eventType && { eventType: filters.eventType }),
                ...(filters?.userId && { userId: filters.userId }),
                ...(filters?.ideaId && { ideaId: filters.ideaId }),
                ...(filters?.businessPlanId && { businessPlanId: filters.businessPlanId }),
                ...(filters?.startDate || filters?.endDate
                    ? {
                        createdAt: {
                            ...(filters.startDate && { gte: filters.startDate }),
                            ...(filters.endDate && { lte: filters.endDate }),
                        },
                    }
                    : {}),
            };

            const [events, total] = await Promise.all([
                prisma.analytics.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    take: filters?.limit || 100,
                    skip: filters?.offset || 0,
                }),
                prisma.analytics.count({ where }),
            ]);

            return { events, total };
        } catch (error) {
            logger.error('Error getting analytics', { error });
            throw error;
        }
    }

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(period?: {
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        totalIdeasGenerated: number;
        totalPlansGenerated: number;
        totalPdfsExported: number;
        totalUsers: number;
        eventsByType: Record<string, number>;
        topIndustries: Array<{ industry: string; count: number }>;
    }> {
        try {
            const dateFilter = period?.startDate || period?.endDate
                ? {
                    createdAt: {
                        ...(period.startDate && { gte: period.startDate }),
                        ...(period.endDate && { lte: period.endDate }),
                    },
                }
                : {};

            // Get event counts by type
            const eventCounts = await prisma.analytics.groupBy({
                by: ['eventType'],
                where: dateFilter,
                _count: true,
            });

            const eventsByType: Record<string, number> = {};
            let totalIdeasGenerated = 0;
            let totalPlansGenerated = 0;
            let totalPdfsExported = 0;

            eventCounts.forEach((item: any) => {
                eventsByType[item.eventType] = item._count;
                if (item.eventType === 'idea_generated') totalIdeasGenerated = item._count;
                if (item.eventType === 'plan_generated') totalPlansGenerated = item._count;
                if (item.eventType === 'pdf_exported') totalPdfsExported = item._count;
            });

            // Get total users
            const totalUsers = await prisma.user.count();

            // Get top industries
            const ideas = await prisma.idea.groupBy({
                by: ['industry'],
                where: dateFilter,
                _count: true,
                orderBy: {
                    _count: {
                        industry: 'desc',
                    },
                },
                take: 10,
            });

            const topIndustries = ideas.map((item: any) => ({
                industry: item.industry,
                count: item._count,
            }));

            return {
                totalIdeasGenerated,
                totalPlansGenerated,
                totalPdfsExported,
                totalUsers,
                eventsByType,
                topIndustries,
            };
        } catch (error) {
            logger.error('Error getting dashboard stats', { error });
            throw error;
        }
    }

    /**
     * Get user activity timeline
     */
    async getUserActivityTimeline(
        userId: string,
        limit: number = 50
    ): Promise<Analytics[]> {
        try {
            return await prisma.analytics.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: {
                    idea: {
                        select: {
                            title: true,
                            industry: true,
                        },
                    },
                },
            });
        } catch (error) {
            logger.error('Error getting user activity timeline', { userId, error });
            throw error;
        }
    }

    /**
     * Delete old analytics data (data retention)
     */
    async deleteOldAnalytics(daysToKeep: number = 90): Promise<number> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

            const result = await prisma.analytics.deleteMany({
                where: {
                    createdAt: {
                        lt: cutoffDate,
                    },
                },
            });

            logger.info('Deleted old analytics data', {
                count: result.count,
                cutoffDate,
            });
            return result.count;
        } catch (error) {
            logger.error('Error deleting old analytics', { error });
            throw error;
        }
    }
}

export default new AnalyticsRepository();
