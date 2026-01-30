import aiService from './aiService';
import { PromptBuilder } from '../utils/promptBuilder';
import { LegalCompliance } from '../types';
import logger from '../middleware/logger';

/**
 * Service for generating legal compliance information
 */
export class LegalComplianceService {
    /**
     * Generate legal compliance guide
     */
    async generateCompliance(
        ideaTitle: string,
        industry: string,
        location: string
    ): Promise<LegalCompliance> {
        logger.info('Generating legal compliance guide', { ideaTitle, industry, location });

        const prompt = PromptBuilder.buildLegalCompliancePrompt(ideaTitle, industry, location);
        const systemPrompt =
            'You are a business attorney specializing in startup compliance. Provide accurate, ' +
            'location-specific legal guidance. Return ONLY valid JSON.';

        const compliance = await aiService.generateJSONCompletion<LegalCompliance>(
            prompt,
            systemPrompt
        );

        logger.info('Legal compliance guide generated successfully');
        return compliance;
    }
}

export default new LegalComplianceService();
