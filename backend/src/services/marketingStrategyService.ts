import aiService from './aiService';
import { PromptBuilder } from '../utils/promptBuilder';
import { MarketingStrategy } from '../types';
import logger from '../middleware/logger';

/**
 * Service for generating marketing strategy
 */
export class MarketingStrategyService {
    /**
     * Generate comprehensive marketing strategy
     */
    async generateStrategy(ideaTitle: string, businessModel: string): Promise<MarketingStrategy> {
        logger.info('Generating marketing strategy', { ideaTitle, businessModel });

        const prompt = PromptBuilder.buildMarketingStrategyPrompt(ideaTitle, businessModel);
        const systemPrompt =
            'You are a marketing strategist specializing in startup growth. Provide actionable, ' +
            'data-driven marketing strategies. Return ONLY valid JSON.';

        const strategy = await aiService.generateJSONCompletion<MarketingStrategy>(prompt, systemPrompt);

        logger.info('Marketing strategy generated successfully');
        return strategy;
    }
}

export default new MarketingStrategyService();
