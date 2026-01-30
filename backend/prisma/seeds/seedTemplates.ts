import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
    // Executive Summary Templates
    {
        sectionName: 'executive_summary',
        industry: null,
        templateContent: `{businessName} is a {businessModel} company operating in the {industry} sector. Our mission is to {missionStatement}. 

    We address the critical need for {problemStatement} by offering {solution}. Our target market consists of {targetMarket}, representing a market opportunity of {marketSize}.

    Key highlights:
    - {highlight1}
    - {highlight2}
    - {highlight3}

    We are seeking {fundingAmount} to {fundingPurpose}. With projected revenues of {revenueProjection} within {timeframe}, we expect to achieve profitability by {profitabilityTimeline}.`,
        variables: [
            'businessName',
            'businessModel',
            'industry',
            'missionStatement',
            'problemStatement',
            'solution',
            'targetMarket',
            'marketSize',
            'highlight1',
            'highlight2',
            'highlight3',
            'fundingAmount',
            'fundingPurpose',
            'revenueProjection',
            'timeframe',
            'profitabilityTimeline',
        ],
        version: 1,
    },

    // Market Analysis Template
    {
        sectionName: 'market_analysis',
        industry: null,
        templateContent: `The {industry} market is valued at {marketValue} and is projected to grow at a CAGR of {growthRate} over the next {years} years.

    Target Market Segments:
    1. {segment1}: {segmentDescription1}
    2. {segment2}: {segmentDescription2}
    3. {segment3}: {segmentDescription3}

    Competitive Landscape:
    - Direct Competitors: {directCompetitors}
    - Indirect Competitors: {indirectCompetitors}
    - Our Competitive Advantage: {competitiveAdvantage}

    Market Trends:
    - {trend1}
    - {trend2}
    - {trend3}`,
        variables: [
            'industry',
            'marketValue',
            'growthRate',
            'years',
            'segment1',
            'segmentDescription1',
            'segment2',
            'segmentDescription2',
            'segment3',
            'segmentDescription3',
            'directCompetitors',
            'indirectCompetitors',
            'competitiveAdvantage',
            'trend1',
            'trend2',
            'trend3',
        ],
        version: 1,
    },

    // Marketing Strategy Template
    {
        sectionName: 'marketing_strategy',
        industry: null,
        templateContent: `Brand Positioning:
    {brandPositioning}

    Marketing Channels:
    1. Digital Marketing: {digitalStrategy}
    2. Content Marketing: {contentStrategy}
    3. Social Media: {socialStrategy}
    4. Partnerships: {partnershipStrategy}

    Customer Acquisition:
    - CAC Target: {cacTarget}
    - LTV Target: {ltvTarget}
    - Conversion Funnel: {conversionFunnel}

    Budget Allocation:
    - Digital Ads: {digitalBudget}%
    - Content Creation: {contentBudget}%
    - Events & PR: {eventsBudget}%
    - Other: {otherBudget}%`,
        variables: [
            'brandPositioning',
            'digitalStrategy',
            'contentStrategy',
            'socialStrategy',
            'partnershipStrategy',
            'cacTarget',
            'ltvTarget',
            'conversionFunnel',
            'digitalBudget',
            'contentBudget',
            'eventsBudget',
            'otherBudget',
        ],
        version: 1,
    },

    // Financial Projections Template
    {
        sectionName: 'financial_projections',
        industry: null,
        templateContent: `Startup Costs:
    - Initial Investment: {initialInvestment}
    - Equipment & Technology: {equipmentCost}
    - Marketing & Sales: {marketingCost}
    - Working Capital: {workingCapital}
    Total: {totalStartupCost}

    Revenue Projections (3 Years):
    - Year 1: {year1Revenue}
    - Year 2: {year2Revenue}
    - Year 3: {year3Revenue}

    Key Metrics:
    - Gross Margin: {grossMargin}%
    - Net Margin: {netMargin}%
    - Break-Even: {breakEvenMonth} months
    - ROI: {roi}%`,
        variables: [
            'initialInvestment',
            'equipmentCost',
            'marketingCost',
            'workingCapital',
            'totalStartupCost',
            'year1Revenue',
            'year2Revenue',
            'year3Revenue',
            'grossMargin',
            'netMargin',
            'breakEvenMonth',
            'roi',
        ],
        version: 1,
    },

    // Operations Plan Template
    {
        sectionName: 'operations_plan',
        industry: null,
        templateContent: `Operations Overview:
    {operationsOverview}

    Key Processes:
    1. {process1}
    2. {process2}
    3. {process3}

    Technology Stack:
    - {tech1}
    - {tech2}
    - {tech3}

    Supply Chain:
    {supplyChainDescription}

    Quality Assurance:
    {qualityAssurance}

    Scaling Strategy:
    - Phase 1: {phase1}
    - Phase 2: {phase2}
    - Phase 3: {phase3}`,
        variables: [
            'operationsOverview',
            'process1',
            'process2',
            'process3',
            'tech1',
            'tech2',
            'tech3',
            'supplyChainDescription',
            'qualityAssurance',
            'phase1',
            'phase2',
            'phase3',
        ],
        version: 1,
    },

    // Legal Compliance Template
    {
        sectionName: 'legal_compliance',
        industry: null,
        templateContent: `Business Structure: {businessStructure}

    Required Licenses & Permits:
    - {license1}
    - {license2}
    - {license3}

    Insurance Requirements:
    - {insurance1}
    - {insurance2}
    - {insurance3}

    Intellectual Property:
    {ipStrategy}

    Compliance Calendar:
    - {compliance1}
    - {compliance2}
    - {compliance3}

    Legal Advisors:
    {legalAdvisors}`,
        variables: [
            'businessStructure',
            'license1',
            'license2',
            'license3',
            'insurance1',
            'insurance2',
            'insurance3',
            'ipStrategy',
            'compliance1',
            'compliance2',
            'compliance3',
            'legalAdvisors',
        ],
        version: 1,
    },
];

async function seedTemplates() {
    console.log('🌱 Seeding templates...');

    for (const template of templates) {
        await prisma.template.create({
            data: {
                ...template,
                variables: template.variables as any,
            },
        });
    }

    console.log(`✅ Seeded ${templates.length} templates`);
}

export default seedTemplates;

// Run if executed directly
if (require.main === module) {
    seedTemplates()
        .catch((e) => {
            console.error('❌ Error seeding templates:', e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
