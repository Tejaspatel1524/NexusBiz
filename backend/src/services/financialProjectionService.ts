import aiService from './aiService';
import { PromptBuilder } from '../utils/promptBuilder';
import { FinancialCalculators } from '../utils/calculators';
import { FinancialProjections } from '../types';
import logger from '../middleware/logger';

/**
 * Service for generating financial projections
 */
export class FinancialProjectionService {
    /**
     * Generate comprehensive financial projections
     */
    async generateProjections(ideaTitle: string, budget: string): Promise<FinancialProjections> {
        logger.info('Generating financial projections', { ideaTitle, budget });

        const prompt = PromptBuilder.buildFinancialProjectionsPrompt(ideaTitle, budget);
        const systemPrompt =
            'You are a financial analyst and business planner. Provide realistic, industry-standard financial projections. ' +
            'Ensure all calculations are mathematically sound. Return ONLY valid JSON.';

        const rawProjections = await aiService.generateJSONCompletion<any>(prompt, systemPrompt);

        // Calculate total startup cost
        const totalStartupCost = FinancialCalculators.aggregateStartupCosts(
            rawProjections.startupCosts || []
        );

        // Validate and format the projections
        const projections: FinancialProjections = {
            startupCosts: rawProjections.startupCosts || [],
            totalStartupCost,
            revenueProjections: rawProjections.revenueProjections || {
                labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
                yearOne: [100000, 150000, 220000, 310000, 0, 0],
                yearTwo: [0, 0, 0, 0, 450000, 600000],
                yearThree: [800000, 0, 0, 0, 0, 0],
            },
            expenseModel: rawProjections.expenseModel || { fixedCosts: [], variableCosts: [] },
            breakEvenAnalysis: rawProjections.breakEvenAnalysis || {
                breakEvenPoint: 0,
                timeToBreakEven: '12 months',
                monthlySalesNeeded: 0,
            },
            metrics: rawProjections.metrics || {
                grossMargin: 0,
                netMargin: 0,
                roi: 0,
                paybackPeriod: '2 years',
            },
            pricingStrategy: rawProjections.pricingStrategy || 'Competitive pricing strategy',
        };

        logger.info('Financial projections generated successfully');
        return projections;
    }
}

export default new FinancialProjectionService();
