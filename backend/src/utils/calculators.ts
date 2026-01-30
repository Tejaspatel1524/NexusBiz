import { DIFFICULTY_WEIGHTS, VIABILITY_WEIGHTS, BUDGET_MULTIPLIERS } from '../config/constants';

/**
 * Financial calculation utilities
 */
export class FinancialCalculators {
    /**
     * Calculate difficulty score (0-100)
     */
    static calculateDifficultyScore(params: {
        capitalRequirements: number; // 0-100
        marketCompetition: number; // 0-100
        technicalComplexity: number; // 0-100
        timeToMarket: number; // 0-100
    }): number {
        const score =
            params.capitalRequirements * DIFFICULTY_WEIGHTS.capitalRequirements +
            params.marketCompetition * DIFFICULTY_WEIGHTS.marketCompetition +
            params.technicalComplexity * DIFFICULTY_WEIGHTS.technicalComplexity +
            params.timeToMarket * DIFFICULTY_WEIGHTS.timeToMarket;

        return Math.round(score);
    }

    /**
     * Calculate viability score (0-100)
     */
    static calculateViabilityScore(params: {
        marketSize: number; // 0-100
        profitMargin: number; // 0-100
        barriersToEntry: number; // 0-100 (lower is better, inverted)
        trendAlignment: number; // 0-100
        resourceMatch: number; // 0-100
    }): number {
        const score =
            params.marketSize * VIABILITY_WEIGHTS.marketSize +
            params.profitMargin * VIABILITY_WEIGHTS.profitMargin +
            (100 - params.barriersToEntry) * VIABILITY_WEIGHTS.barriersToEntry +
            params.trendAlignment * VIABILITY_WEIGHTS.trendAlignment +
            params.resourceMatch * VIABILITY_WEIGHTS.resourceMatch;

        return Math.round(score);
    }

    /**
     * Calculate break-even point
     */
    static calculateBreakEven(
        fixedCosts: number,
        pricePerUnit: number,
        variableCostPerUnit: number
    ): number {
        if (pricePerUnit <= variableCostPerUnit) {
            throw new Error('Price per unit must be greater than variable cost per unit');
        }
        return Math.ceil(fixedCosts / (pricePerUnit - variableCostPerUnit));
    }

    /**
     * Calculate revenue projection with growth rate
     */
    static calculateRevenueProjection(
        baseRevenue: number,
        growthRate: number,
        periods: number
    ): number[] {
        const projections: number[] = [];
        for (let i = 0; i < periods; i++) {
            projections.push(Math.round(baseRevenue * Math.pow(1 + growthRate, i)));
        }
        return projections;
    }

    /**
     * Calculate Customer Acquisition Cost (CAC)
     */
    static calculateCAC(marketingSpend: number, newCustomers: number): number {
        if (newCustomers === 0) return 0;
        return Math.round(marketingSpend / newCustomers);
    }

    /**
     * Calculate Customer Lifetime Value (LTV)
     */
    static calculateLTV(averageRevenuePerCustomer: number, avgLifespanYears: number): number {
        return Math.round(averageRevenuePerCustomer * avgLifespanYears);
    }

    /**
     * Calculate cash flow
     */
    static calculateCashFlow(revenue: number, expenses: number, financing: number = 0): number {
        return revenue - expenses + financing;
    }

    /**
     * Calculate ROI percentage
     */
    static calculateROI(gain: number, cost: number): number {
        if (cost === 0) return 0;
        return Math.round(((gain - cost) / cost) * 100);
    }

    /**
     * Calculate gross margin percentage
     */
    static calculateGrossMargin(revenue: number, cogs: number): number {
        if (revenue === 0) return 0;
        return parseFloat((((revenue - cogs) / revenue) * 100).toFixed(2));
    }

    /**
     * Calculate net margin percentage
     */
    static calculateNetMargin(revenue: number, totalExpenses: number): number {
        if (revenue === 0) return 0;
        return parseFloat((((revenue - totalExpenses) / revenue) * 100).toFixed(2));
    }

    /**
     * Aggregate startup costs
     */
    static aggregateStartupCosts(costs: { amount: number }[]): number {
        return costs.reduce((total, cost) => total + cost.amount, 0);
    }

    /**
     * Get budget multiplier from budget range string
     */
    static getBudgetMultiplier(budgetRange: string): number {
        return BUDGET_MULTIPLIERS[budgetRange] || 50000;
    }
}
