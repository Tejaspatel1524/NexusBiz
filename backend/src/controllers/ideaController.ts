import { Request, Response, NextFunction } from 'express';
import ideaGenerationService from '../services/ideaGenerationService';
import { UserInput, APIResponse, BusinessIdea } from '../types';
import logger from '../middleware/logger';

// In-memory storage (replace with database in production)
const ideasStore: Map<string, BusinessIdea> = new Map();

/**
 * Controller for idea generation endpoints
 */
export class IdeaController {
    /**
     * Generate business ideas
     * POST /api/ideas/generate
     */
    async generateIdeas(
        req: Request<{}, {}, UserInput>,
        res: Response<APIResponse<BusinessIdea[]>>,
        next: NextFunction
    ): Promise<void> {
        try {
            const userInput = req.body;
            logger.info('Received idea generation request', { industry: userInput.industry });

            const ideas = await ideaGenerationService.generateIdeas(userInput);

            // Store ideas
            ideas.forEach((idea) => ideasStore.set(idea.id, idea));

            res.status(200).json({
                success: true,
                data: ideas,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get idea by ID
     * GET /api/ideas/:id
     */
    async getIdeaById(
        req: Request<{ id: string }>,
        res: Response<APIResponse<BusinessIdea>>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const idea = ideasStore.get(id);

            if (!idea) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Idea not found',
                    },
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: idea,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all industries
     * GET /api/industries
     */
    async getIndustries(
        _req: Request,
        res: Response<APIResponse<any>>,
        _next: NextFunction
    ): Promise<void> {
        try {
            const industries = [
                { value: 'Technology', label: 'Technology', growth: '+15%' },
                { value: 'Healthcare', label: 'Healthcare', growth: '+12%' },
                { value: 'Finance', label: 'Finance', growth: '+8%' },
                { value: 'Education', label: 'Education', growth: '+10%' },
                { value: 'Retail', label: 'Retail', growth: '+5%' },
                { value: 'Manufacturing', label: 'Manufacturing', growth: '+7%' },
                { value: 'Energy', label: 'Energy', growth: '+9%' },
                { value: 'Transportation', label: 'Transportation', growth: '+6%' },
                { value: 'Entertainment', label: 'Entertainment', growth: '+11%' },
                { value: 'Real Estate', label: 'Real Estate', growth: '+8%' },
                { value: 'Food & Beverage', label: 'Food & Beverage', growth: '+7%' },
                { value: 'Aerospace', label: 'Aerospace', growth: '+10%' },
                { value: 'Agriculture', label: 'Agriculture', growth: '+6%' },
                { value: 'Construction', label: 'Construction', growth: '+8%' },
                { value: 'Hospitality', label: 'Hospitality', growth: '+9%' },
                { value: 'Media', label: 'Media', growth: '+12%' },
                { value: 'Telecommunications', label: 'Telecommunications', growth: '+11%' },
                { value: 'E-commerce', label: 'E-commerce', growth: '+18%' },
                { value: 'Automotive', label: 'Automotive', growth: '+7%' },
                { value: 'Pharmaceuticals', label: 'Pharmaceuticals', growth: '+13%' },
            ];

            res.status(200).json({
                success: true,
                data: industries,
            });
        } catch (error) {
            _next(error);
        }
    }
}

export default new IdeaController();
