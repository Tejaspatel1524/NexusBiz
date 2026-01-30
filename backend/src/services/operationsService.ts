import aiService from './aiService';
import { PromptBuilder } from '../utils/promptBuilder';
import { OperationsPlan } from '../types';
import logger from '../middleware/logger';

/**
 * Service for generating operations plan
 */
export class OperationsService {
    /**
     * Generate comprehensive operations plan
     */
    async generatePlan(ideaTitle: string, industry: string): Promise<OperationsPlan> {
        logger.info('Generating operations plan', { ideaTitle, industry });

        const prompt = PromptBuilder.buildOperationsPlanPrompt(ideaTitle, industry);
        const systemPrompt =
            'You are an operations management consultant. Provide detailed, practical operations plans. ' +
            'Return ONLY valid JSON.';

        const plan = await aiService.generateJSONCompletion<OperationsPlan>(prompt, systemPrompt);

        logger.info('Operations plan generated successfully');
        return plan;
    }
}

export default new OperationsService();
