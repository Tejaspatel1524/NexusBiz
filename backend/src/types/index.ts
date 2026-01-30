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

export interface UserInput {
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
    difficultyScore: number;
    viabilityScore: number;
    investmentNeeded: string;
    timeline: string;
    potentialROI: string;
    keyStrengths: string[];
    challenges: string[];
}

export interface MarketAnalysis {
    overview: string;
    targetMarket: string;
    customerPersonas: CustomerPersona[];
    competitors: string[];
    swotAnalysis: SWOTAnalysis;
    marketSize: string;
    trends: string[];
    uniqueValueProposition: string;
}

export interface CustomerPersona {
    name: string;
    age: string;
    occupation: string;
    painPoints: string[];
    motivations: string[];
}

export interface SWOTAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface FinancialProjections {
    startupCosts: StartupCost[];
    totalStartupCost: number;
    revenueProjections: {
        labels: string[];
        yearOne: number[];
        yearTwo: number[];
        yearThree: number[];
    };
    expenseModel: ExpenseModel;
    breakEvenAnalysis: BreakEvenAnalysis;
    metrics: FinancialMetrics;
    pricingStrategy: string;
}

export interface StartupCost {
    category: string;
    amount: number;
    description: string;
}

export interface ExpenseModel {
    fixedCosts: { category: string; monthly: number }[];
    variableCosts: { category: string; perUnit: number }[];
}

export interface BreakEvenAnalysis {
    breakEvenPoint: number;
    timeToBreakEven: string;
    monthlySalesNeeded: number;
}

export interface FinancialMetrics {
    grossMargin: number;
    netMargin: number;
    roi: number;
    paybackPeriod: string;
}

export interface MarketingStrategy {
    channels: MarketingChannel[];
    brandPositioning: string;
    customerAcquisition: string;
    budgetAllocation: { channel: string; percentage: number }[];
    socialMediaStrategy: string;
    seoSemRecommendations: string[];
    retentionTactics: string[];
}

export interface MarketingChannel {
    name: string;
    description: string;
    estimatedCost: string;
    expectedROI: string;
}

export interface OperationsPlan {
    workflow: string;
    supplyChain: string;
    technologyRequirements: string[];
    qualityControl: string;
    scalingRoadmap: string[];
    automationOpportunities: string[];
    vendorRequirements: string[];
}

export interface LegalCompliance {
    recommendedStructure: string;
    licensesPermits: string[];
    insuranceRequirements: string[];
    ipProtection: string[];
    complianceCalendar: { item: string; deadline: string }[];
    employmentLaw: string[];
}

export interface BusinessPlan {
    id: string;
    ideaId: string;
    title: string;
    executiveSummary: string;
    marketAnalysis: MarketAnalysis;
    marketingStrategy: MarketingStrategy;
    financialProjections: FinancialProjections;
    operationsPlan: OperationsPlan;
    legalCompliance: LegalCompliance;
    implementationTimeline: { milestone: string; date: string }[];
    riskAnalysis: { risk: string; mitigation: string }[];
}

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
