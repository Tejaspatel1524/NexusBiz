import { Router } from 'express';
import businessPlanController from '../controllers/businessPlanController';
import { validateRequest } from '../middleware/validateRequest';
import { businessPlanLimiter, generalLimiter } from '../middleware/rateLimiter';
import { BusinessPlanRequestSchema } from '../utils/validators';

const router = Router();

/**
 * POST /api/business-plan/generate
 * Generate comprehensive business plan
 */
router.post(
    '/generate',
    businessPlanLimiter,
    validateRequest(BusinessPlanRequestSchema),
    businessPlanController.generateBusinessPlan.bind(businessPlanController)
);

/**
 * GET /api/business-plan/:id
 * Retrieve business plan by ID
 */
router.get(
    '/:id',
    generalLimiter,
    businessPlanController.getBusinessPlanById.bind(businessPlanController)
);

export default router;
