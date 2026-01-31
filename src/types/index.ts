export type Industry =
    | 'Technology'
    | 'Healthcare'
    | 'Finance'
    | 'Education'
    | 'Retail'
    | 'Manufacturing'
    | 'Energy'
    | 'Transportation'
    | 'Entertainment'
    | 'Real Estate'
    | 'Food & Beverage'
    | 'Aerospace'
    | 'Agriculture'
    | 'Construction'
    | 'Hospitality'
    | 'Media'
    | 'Telecommunications'
    | 'E-commerce'
    | 'Automotive'
    | 'Pharmaceuticals';

export type BudgetRange = '$0-$10k' | '$10k-$50k' | '$50k-$100k' | '$100k-$500k' | '$500k+';

export type TimelinePreference = '3 months' | '6 months' | '1 year' | '2+ years';

export type RiskTolerance = 'Low' | 'Medium' | 'High';

export type BusinessModel = 'B2B' | 'B2C' | 'B2B2C' | 'Marketplace' | 'SaaS' | 'E-commerce' | 'Services';

export type MarketSize = 'Local' | 'Regional' | 'National' | 'International';

export type InnovationLevel = 'Incremental' | 'Moderate' | 'Disruptive';

export interface BusinessIdeaInputs {
    industry: Industry;
    budget: BudgetRange;
    location: string;
    timeline: TimelinePreference;
    skills: string[];
    resources: {
        team: boolean;
        office: boolean;
        equipment: boolean;
        funding: boolean;
    };
    riskTolerance: RiskTolerance;
    businessModel: BusinessModel;
    marketSize: MarketSize;
    innovationLevel: InnovationLevel;
}

export interface BusinessIdea {
    id: string;
    title: string;
    description: string;
    industry: Industry;
    difficultyScore: number; // 1-10
    investmentNeeded: string;
    potentialROI: string;
    timeline: string;
    estimatedBudget?: string; // Optional budget estimate
}

export interface BusinessPlanDetails {
    id: string;
    title: string;
    description?: string; // Optional description for context
    industry?: string; // Optional industry for context
    executiveSummary: string;
    marketAnalysis: {
        overview: string;
        trends: string[];
        competitors: string[];
    };
    marketingStrategy: string[];
    financialProjections: {
        yearOne: number[];
        yearTwo: number[];
        yearThree: number[];
        labels: string[];
    };
    operationsPlan: string;
    productionLogistics: string;
    legalCompliance: string;
    hrTeamStructure: string;
    technologyRequirements: string[];
    implementationTimeline: {
        milestone: string;
        date: string;
    }[];
    riskAnalysis: {
        risk: string;
        mitigation: string;
    }[];
}
