import aiService from './aiService';
import { PromptBuilder } from '../utils/promptBuilder';
import { MarketAnalysis } from '../types';
import logger from '../middleware/logger';

/**
 * Service for generating market analysis
 */
export class MarketAnalysisService {
    /**
     * Generate comprehensive market analysis
     */
    async generateAnalysis(
        ideaTitle: string,
        ideaDescription: string,
        industry: string
    ): Promise<MarketAnalysis> {
        logger.info('Generating market analysis', { ideaTitle, industry });

        const prompt = PromptBuilder.buildMarketAnalysisPrompt(ideaTitle, ideaDescription, industry);
        const systemPrompt =
            'You are a professional market research analyst. Provide data-driven, factual market analysis. ' +
            'Include real competitors and tangible market data where possible. Return ONLY valid JSON.';

        const analysis = await aiService.generateJSONCompletion<MarketAnalysis>(prompt, systemPrompt);

        logger.info('Market analysis generated successfully');
        return analysis;
    }
}

export default new MarketAnalysisService();
