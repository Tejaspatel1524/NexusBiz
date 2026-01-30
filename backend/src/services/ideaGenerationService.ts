import { v4 as uuidv4 } from 'uuid';
import aiService from './aiService';
import { PromptBuilder } from '../utils/promptBuilder';
import { FinancialCalculators } from '../utils/calculators';
import { UserInput, BusinessIdea } from '../types';
import logger from '../middleware/logger';

/**
 * Service for generating business ideas using AI
 */
export class IdeaGenerationService {
    /**
     * Generate 3-5 business ideas based on user input
     */
    async generateIdeas(input: UserInput): Promise<BusinessIdea[]> {
        logger.info('Generating business ideas', { industry: input.industry, budget: input.budget });

        const prompt = PromptBuilder.buildIdeaGenerationPrompt(input);
        const systemPrompt =
            'You are an expert business consultant specializing in startup ideation. ' +
            'Generate practical, market-validated business ideas. Return ONLY valid JSON, no additional commentary.';

        const aiIdeas = await aiService.generateJSONCompletion<any[]>(prompt, systemPrompt);

        // Process and score each idea
        const ideas: BusinessIdea[] = aiIdeas.map((rawIdea) => {
            // Calculate scores based on idea characteristics
            const difficultyScore = this.calculateDifficultyScore(rawIdea, input);
            const viabilityScore = this.calculateViabilityScore(rawIdea, input);

            return {
                id: uuidv4(),
                title: rawIdea.title,
                description: rawIdea.description,
                industry: input.industry,
                difficultyScore,
                viabilityScore,
                investmentNeeded: rawIdea.estimatedInvestment || input.budget,
                timeline: rawIdea.timeToLaunch || input.timeline,
                potentialROI: rawIdea.potentialROI || '200% over 3 years',
                keyStrengths: rawIdea.keyStrengths || [],
                challenges: rawIdea.challenges || [],
            };
        });

        logger.info(`Generated ${ideas.length} business ideas`);
        return ideas;
    }

    /**
     * Calculate difficulty score for an idea
     */
    private calculateDifficultyScore(_idea: any, input: UserInput): number {
        // Estimate capital requirements based on budget
        const budgetMultiplier = FinancialCalculators.getBudgetMultiplier(input.budget);
        const capitalScore = Math.min(100, (budgetMultiplier / 500000) * 100);

        // Market competition (estimated from industry)
        const competitiveIndustries = ['Technology', 'E-commerce', 'Retail', 'Finance'];
        const competitionScore = competitiveIndustries.includes(input.industry) ? 75 : 50;

        // Technical complexity (inferred from innovation level)
        const complexityMap: Record<string, number> = {
            Incremental: 30,
            Moderate: 60,
            Disruptive: 90,
        };
        const complexityScore = complexityMap[input.innovationLevel] || 50;

        // Time to market (from timeline)
        const timelineMap: Record<string, number> = {
            '3 months': 80,
            '6 months': 60,
            '1 year': 40,
            '2+ years': 20,
        };
        const timeScore = timelineMap[input.timeline] || 50;

        return FinancialCalculators.calculateDifficultyScore({
            capitalRequirements: capitalScore,
            marketCompetition: competitionScore,
            technicalComplexity: complexityScore,
            timeToMarket: timeScore,
        });
    }

    /**
     * Calculate viability score for an idea
     */
    private calculateViabilityScore(_idea: any, input: UserInput): number {
        // Market size (based on market size preference)
        const marketMap: Record<string, number> = {
            Local: 40,
            Regional: 60,
            National: 80,
            International: 95,
        };
        const marketScore = marketMap[input.marketSize] || 60;

        // Profit margin (estimated by business model)
        const profitMap: Record<string, number> = {
            SaaS: 85,
            Services: 70,
            'E-commerce': 45,
            B2B: 65,
            B2C: 55,
            B2B2C: 60,
            Marketplace: 75,
        };
        const profitScore = profitMap[input.businessModel] || 60;

        // Barriers to entry (inverse of difficulty)
        const barrierScore = 50;

        // Trend alignment (based on innovation level)
        const trendMap: Record<string, number> = {
            Disruptive: 90,
            Moderate: 70,
            Incremental: 50,
        };
        const trendScore = trendMap[input.innovationLevel] || 70;

        // Resource match (based on available resources)
        const resourceCount = Object.values(input.resources).filter(Boolean).length;
        const resourceScore = (resourceCount / 4) * 100;

        return FinancialCalculators.calculateViabilityScore({
            marketSize: marketScore,
            profitMargin: profitScore,
            barriersToEntry: barrierScore,
            trendAlignment: trendScore,
            resourceMatch: resourceScore,
        });
    }
}

export default new IdeaGenerationService();
