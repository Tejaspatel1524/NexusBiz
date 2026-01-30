import { Router } from 'express';
import ideaController from '../controllers/ideaController';
import { validateRequest } from '../middleware/validateRequest';
import { ideaGenerationLimiter, generalLimiter } from '../middleware/rateLimiter';
import { UserInputSchema } from '../utils/validators';

const router = Router();

/**
 * POST /api/ideas/generate
 * Generate business ideas based on user input
 */
router.post(
    '/generate',
    ideaGenerationLimiter,
    validateRequest(UserInputSchema),
    ideaController.generateIdeas.bind(ideaController)
);

/**
 * GET /api/ideas/:id
 * Retrieve specific idea by ID
 */
router.get(
    '/:id',
    generalLimiter,
    ideaController.getIdeaById.bind(ideaController)
);

export default router;
