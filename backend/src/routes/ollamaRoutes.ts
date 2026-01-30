import { Router } from 'express';
import {
    generateIdeas,
    generateBusinessPlan,
    chat,
    getServiceStats,
    healthCheck
} from '../controllers/ollamaController';
import { directGenerateIdeasSimple, directHealth } from '../controllers/directOllamaController';

const router = Router();

/**
 * Ollama AI routes for local LLM integration
 */

// SIMPLE REST endpoint (most reliable) - USE THIS!
router.post('/simple-generate-ideas', directGenerateIdeasSimple);
router.get('/direct-health', directHealth);

// Legacy routes (with SSE streaming, less reliable)
router.post('/generate-ideas', generateIdeas);
router.post('/business-plan', generateBusinessPlan);
router.post('/chat', chat);
router.get('/stats', getServiceStats);
router.get('/health', healthCheck);

export default router;
