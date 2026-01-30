export const INDUSTRIES = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Energy',
    'Transportation',
    'Entertainment',
    'Real Estate',
    'Food & Beverage',
    'Aerospace',
    'Agriculture',
    'Construction',
    'Hospitality',
    'Media',
    'Telecommunications',
    'E-commerce',
    'Automotive',
    'Pharmaceuticals',
] as const;

export const BUDGET_MULTIPLIERS: Record<string, number> = {
    '$0-$10k': 5000,
    '$10k-$50k': 30000,
    '$50k-$100k': 75000,
    '$100k-$500k': 300000,
    '$500k+': 1000000,
};

export const DIFFICULTY_WEIGHTS = {
    capitalRequirements: 0.3,
    marketCompetition: 0.25,
    technicalComplexity: 0.25,
    timeToMarket: 0.2,
};

export const VIABILITY_WEIGHTS = {
    marketSize: 0.3,
    profitMargin: 0.25,
    barriersToEntry: 0.2,
    trendAlignment: 0.15,
    resourceMatch: 0.1,
};

export const AI_CONFIG = {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4096,
    temperature: 0.7,
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
};

export const PDF_CONFIG = {
    pageSize: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
};
