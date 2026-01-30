import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import marketAnalysisService from '../services/marketAnalysisService';
import financialProjectionService from '../services/financialProjectionService';
import marketingStrategyService from '../services/marketingStrategyService';
import operationsService from '../services/operationsService';
import legalComplianceService from '../services/legalComplianceService';
import { BusinessPlan, APIResponse } from '../types';
import logger from '../middleware/logger';

// In-memory storage
const businessPlansStore: Map<string, BusinessPlan> = new Map();

/**
 * Controller for business plan generation
 */
export class BusinessPlanController {
    /**
     * Generate complete business plan
     * POST /api/business-plan/generate
     */
    async generateBusinessPlan(
        req: Request,
        res: Response<APIResponse<BusinessPlan>>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { idea, userInput } = req.body;

            if (!idea || !idea.title || !idea.description || !idea.industry) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Idea object with title, description, and industry is required',
                    },
                });
                return;
            }

            logger.info('Generating business plan', { ideaTitle: idea.title });

            // Generate all sections in parallel
            const [marketAnalysis, financialProjections, marketingStrategy, operationsPlan, legalCompliance] =
                await Promise.all([
                    marketAnalysisService.generateAnalysis(idea.title, idea.description, idea.industry),
                    financialProjectionService.generateProjections(
                        idea.title,
                        userInput?.budget || '$50k-$100k'
                    ),
                    marketingStrategyService.generateStrategy(
                        idea.title,
                        userInput?.businessModel || 'B2B'
                    ),
                    operationsService.generatePlan(idea.title, idea.industry),
                    legalComplianceService.generateCompliance(
                        idea.title,
                        idea.industry,
                        userInput?.location || 'United States'
                    ),
                ]);

            // Create business plan
            const businessPlan: BusinessPlan = {
                id: uuidv4(),
                ideaId: req.body.ideaId || uuidv4(),
                title: idea.title,
                executiveSummary: `${idea.title} is ${idea.description}. This venture leverages modern business strategies to disrupt the ${idea.industry} sector, targeting ${marketAnalysis.targetMarket} with a unique value proposition: ${marketAnalysis.uniqueValueProposition}.`,
                marketAnalysis,
                marketingStrategy,
                financialProjections,
                operationsPlan,
                legalCompliance,
                implementationTimeline: [
                    { milestone: 'Business Registration & Setup', date: 'Month 1' },
                    { milestone: 'Product Development & Testing', date: 'Month 1-3' },
                    { milestone: 'Marketing Launch', date: 'Month 3' },
                    { milestone: 'First Customer Acquisition', date: 'Month 4' },
                    { milestone: 'Scale Operations', date: 'Month 6-12' },
                ],
                riskAnalysis: marketAnalysis.swotAnalysis.threats.slice(0, 3).map((threat) => ({
                    risk: threat,
                    mitigation: 'Continuous monitoring and agile response strategies',
                })),
            };

            // Store plan
            businessPlansStore.set(businessPlan.id, businessPlan);

            logger.info('Business plan generated successfully', { planId: businessPlan.id });

            res.status(200).json({
                success: true,
                data: businessPlan,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get business plan by ID
     * GET /api/business-plan/:id
     */
    async getBusinessPlanById(
        req: Request<{ id: string }>,
        res: Response<APIResponse<BusinessPlan>>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const plan = businessPlansStore.get(id);

            if (!plan) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Business plan not found',
                    },
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: plan,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new BusinessPlanController();
