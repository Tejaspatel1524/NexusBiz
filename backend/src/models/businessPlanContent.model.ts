import mongoose, { Schema, Document } from 'mongoose';

// ===== INTERFACES =====

interface ICustomerPersona {
    name: string;
    demographics: Record<string, any>;
    painPoints: string[];
    buyingBehavior: string;
}

interface ICompetitor {
    name: string;
    strengths: string[];
    weaknesses: string[];
    marketShare: string;
}

interface ISWOTAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

interface IMarketSize {
    estimate: string;
    growthRate: number;
    sources: string[];
}

interface ITargetChannel {
    channel: string;
    budgetAllocation: number;
    expectedRoi: string;
    tactics: string[];
}

interface ICustomerAcquisition {
    strategies: string[];
    estimatedCac: number;
    conversionFunnel: Record<string, any>;
}

interface IStartupCost {
    category: string;
    amount: number;
    description: string;
}

interface IRevenueProjection {
    period: string;
    revenue: number;
    assumptions: string[];
}

interface IExpenseProjection {
    period: string;
    expenses: number;
    breakdown: Record<string, any>;
}

interface ICashFlow {
    period: string;
    cashIn: number;
    cashOut: number;
    netCashFlow: number;
    cumulative: number;
}

interface IBreakEvenAnalysis {
    breakEvenUnits: number;
    breakEvenRevenue: number;
    timeToBreakEven: string;
}

interface IKeyMetrics {
    grossMargin: number;
    netMargin: number;
    roi: number;
    paybackPeriod: string;
}

interface IKeyRole {
    title: string;
    responsibilities: string[];
    qualifications: string[];
    salaryRange: string;
}

interface IMilestone {
    phase: string;
    duration: string;
    tasks: string[];
    dependencies: string[];
}

interface IRisk {
    category: string;
    description: string;
    probability: string;
    impact: string;
    mitigation: string;
}

// ===== DOCUMENT INTERFACE =====

export interface IBusinessPlanContent extends Document {
    businessPlanId: string;
    ideaId: string;

    executiveSummary?: {
        content: string;
        wordCount: number;
        generatedAt: Date;
    };

    marketAnalysis?: {
        targetMarket: string;
        marketSize: IMarketSize;
        customerPersonas: ICustomerPersona[];
        competitors: ICompetitor[];
        swotAnalysis: ISWOTAnalysis;
        generatedAt: Date;
    };

    marketingStrategy?: {
        positioningStatement: string;
        targetChannels: ITargetChannel[];
        contentCalendar: Record<string, any>;
        brandGuidelines: Record<string, any>;
        customerAcquisition: ICustomerAcquisition;
        generatedAt: Date;
    };

    financialProjections?: {
        startupCosts: {
            breakdown: IStartupCost[];
            total: number;
        };
        revenueProjections: IRevenueProjection[];
        expenseProjections: IExpenseProjection[];
        cashFlow: ICashFlow[];
        breakEvenAnalysis: IBreakEvenAnalysis;
        keyMetrics: IKeyMetrics;
        generatedAt: Date;
    };

    operationsPlan?: {
        workflow: string;
        supplyChain: Record<string, any>;
        technologyStack: string[];
        qualityControl: Record<string, any>;
        scalingRoadmap: Record<string, any>;
        generatedAt: Date;
    };

    productionLogistics?: {
        productionMethod: string;
        suppliers: Record<string, any>[];
        inventoryManagement: Record<string, any>;
        qualityAssurance: Record<string, any>;
        generatedAt: Date;
    };

    legalCompliance?: {
        businessStructure: string;
        licensesPermits: string[];
        insuranceRequirements: string[];
        ipProtection: Record<string, any>;
        complianceCalendar: Record<string, any>[];
        generatedAt: Date;
    };

    hrTeamStructure?: {
        organizationalChart: string;
        keyRoles: IKeyRole[];
        hiringTimeline: Record<string, any>;
        companyCulture: Record<string, any>;
        generatedAt: Date;
    };

    technologyRequirements?: {
        essentialTools: Record<string, any>[];
        optionalTools: Record<string, any>[];
        infrastructure: Record<string, any>;
        cybersecurity: Record<string, any>;
        generatedAt: Date;
    };

    implementationTimeline?: {
        milestones: IMilestone[];
        criticalPath: string[];
        generatedAt: Date;
    };

    riskAnalysis?: {
        risks: IRisk[];
        contingencyPlans: Record<string, any>[];
        generatedAt: Date;
    };

    metadata: {
        totalGenerationTime: number;
        aiModelUsed: string;
        sectionsRegenerated: string[];
        version: number;
    };

    createdAt: Date;
    updatedAt: Date;
}

// ===== MONGOOSE SCHEMA =====

const BusinessPlanContentSchema = new Schema<IBusinessPlanContent>(
    {
        businessPlanId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        ideaId: {
            type: String,
            required: true,
            index: true,
        },
        executiveSummary: {
            content: String,
            wordCount: Number,
            generatedAt: Date,
        },
        marketAnalysis: {
            targetMarket: String,
            marketSize: {
                estimate: String,
                growthRate: Number,
                sources: [String],
            },
            customerPersonas: [
                {
                    name: String,
                    demographics: Schema.Types.Mixed,
                    painPoints: [String],
                    buyingBehavior: String,
                },
            ],
            competitors: [
                {
                    name: String,
                    strengths: [String],
                    weaknesses: [String],
                    marketShare: String,
                },
            ],
            swotAnalysis: {
                strengths: [String],
                weaknesses: [String],
                opportunities: [String],
                threats: [String],
            },
            generatedAt: Date,
        },
        marketingStrategy: {
            positioningStatement: String,
            targetChannels: [
                {
                    channel: String,
                    budgetAllocation: Number,
                    expectedRoi: String,
                    tactics: [String],
                },
            ],
            contentCalendar: Schema.Types.Mixed,
            brandGuidelines: Schema.Types.Mixed,
            customerAcquisition: {
                strategies: [String],
                estimatedCac: Number,
                conversionFunnel: Schema.Types.Mixed,
            },
            generatedAt: Date,
        },
        financialProjections: {
            startupCosts: {
                breakdown: [
                    {
                        category: String,
                        amount: Number,
                        description: String,
                    },
                ],
                total: Number,
            },
            revenueProjections: [
                {
                    period: String,
                    revenue: Number,
                    assumptions: [String],
                },
            ],
            expenseProjections: [
                {
                    period: String,
                    expenses: Number,
                    breakdown: Schema.Types.Mixed,
                },
            ],
            cashFlow: [
                {
                    period: String,
                    cashIn: Number,
                    cashOut: Number,
                    netCashFlow: Number,
                    cumulative: Number,
                },
            ],
            breakEvenAnalysis: {
                breakEvenUnits: Number,
                breakEvenRevenue: Number,
                timeToBreakEven: String,
            },
            keyMetrics: {
                grossMargin: Number,
                netMargin: Number,
                roi: Number,
                paybackPeriod: String,
            },
            generatedAt: Date,
        },
        operationsPlan: {
            workflow: String,
            supplyChain: Schema.Types.Mixed,
            technologyStack: [String],
            qualityControl: Schema.Types.Mixed,
            scalingRoadmap: Schema.Types.Mixed,
            generatedAt: Date,
        },
        productionLogistics: {
            productionMethod: String,
            suppliers: [Schema.Types.Mixed],
            inventoryManagement: Schema.Types.Mixed,
            qualityAssurance: Schema.Types.Mixed,
            generatedAt: Date,
        },
        legalCompliance: {
            businessStructure: String,
            licensesPermits: [String],
            insuranceRequirements: [String],
            ipProtection: Schema.Types.Mixed,
            complianceCalendar: [Schema.Types.Mixed],
            generatedAt: Date,
        },
        hrTeamStructure: {
            organizationalChart: String,
            keyRoles: [
                {
                    title: String,
                    responsibilities: [String],
                    qualifications: [String],
                    salaryRange: String,
                },
            ],
            hiringTimeline: Schema.Types.Mixed,
            companyCulture: Schema.Types.Mixed,
            generatedAt: Date,
        },
        technologyRequirements: {
            essentialTools: [Schema.Types.Mixed],
            optionalTools: [Schema.Types.Mixed],
            infrastructure: Schema.Types.Mixed,
            cybersecurity: Schema.Types.Mixed,
            generatedAt: Date,
        },
        implementationTimeline: {
            milestones: [
                {
                    phase: String,
                    duration: String,
                    tasks: [String],
                    dependencies: [String],
                },
            ],
            criticalPath: [String],
            generatedAt: Date,
        },
        riskAnalysis: {
            risks: [
                {
                    category: String,
                    description: String,
                    probability: String,
                    impact: String,
                    mitigation: String,
                },
            ],
            contingencyPlans: [Schema.Types.Mixed],
            generatedAt: Date,
        },
        metadata: {
            totalGenerationTime: { type: Number, default: 0 },
            aiModelUsed: { type: String, default: 'claude-3-5-sonnet-20241022' },
            sectionsRegenerated: { type: [String], default: [] },
            version: { type: Number, default: 1 },
        },
    },
    {
        timestamps: true,
    }
);

// ===== INDEXES =====
BusinessPlanContentSchema.index({ businessPlanId: 1 }, { unique: true });
BusinessPlanContentSchema.index({ ideaId: 1 });
BusinessPlanContentSchema.index({ createdAt: -1 });
BusinessPlanContentSchema.index({ businessPlanId: 1, updatedAt: -1 });

// ===== MODEL =====
export const BusinessPlanContent = mongoose.model<IBusinessPlanContent>(
    'BusinessPlanContent',
    BusinessPlanContentSchema
);
