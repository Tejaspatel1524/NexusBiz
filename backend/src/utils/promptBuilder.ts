import { UserInput } from '../types';

/**
 * Utility class for building AI prompts
 */
export class PromptBuilder {
    /**
     * Build prompt for idea generation
     */
    static buildIdeaGenerationPrompt(input: UserInput): string {
        return `You are a professional business consultant tasked with generating innovative business ideas.

User Requirements:
- Industry: ${input.industry}
- Budget: ${input.budget}
- Location: ${input.location}
- Timeline: ${input.timeline}
- Skills: ${input.skills.join(', ')}
- Resources: ${Object.entries(input.resources).filter(([_, v]) => v).map(([k]) => k).join(', ')}
- Risk Tolerance: ${input.riskTolerance}
- Business Model: ${input.businessModel}
- Market Size: ${input.marketSize}
- Innovation Level: ${input.innovationLevel}

Generate 3-5 highly viable business ideas that match these requirements. For each idea, provide:

Return ONLY a valid JSON array with this exact structure (no additional text):
\`\`\`json
[
  {
    "title": "Business Name",
    "description": "Detailed 2-3 sentence description of the business concept",
    "industry": "${input.industry}",
    "keyStrengths": ["strength 1", "strength 2", "strength 3"],
    "challenges": ["challenge 1", "challenge 2"],
    "estimatedInvestment": "specific dollar amount from user budget range",
    "timeToLaunch": "specific timeframe from user timeline",
    "potentialROI": "percentage over timeframe"
  }
]
\`\`\`

Requirements:
- Ideas must be realistic and executable within the specified budget and timeline
- Focus on current market trends and gaps
- Consider the user's existing skills and resources
- Ensure ideas align with the selected innovation level
- Be specific with numbers and timelines`;
    }

    /**
     * Build prompt for market analysis
     */
    static buildMarketAnalysisPrompt(ideaTitle: string, ideaDescription: string, industry: string): string {
        return `Conduct a comprehensive market analysis for this business idea:

Title: ${ideaTitle}
Description: ${ideaDescription}
Industry: ${industry}

Provide a detailed market analysis in the following JSON format:
\`\`\`json
{
  "overview": "2-3 paragraph market overview",
  "targetMarket": "Specific description of target market segment",
  "customerPersonas": [
    {
      "name": "Persona name",
      "age": "Age range",
      "occupation": "Job title/role",
      "painPoints": ["pain point 1", "pain point 2", "pain point 3"],
      "motivations": ["motivation 1", "motivation 2"]
    }
  ],
  "competitors": ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"],
  "swotAnalysis": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
    "threats": ["threat 1", "threat 2", "threat 3"]
  },
  "marketSize": "Estimated market size with numbers",
  "trends": ["trend 1", "trend 2", "trend 3", "trend 4"],
  "uniqueValueProposition": "Clear statement of unique value"
}
\`\`\`

Be data-driven and specific. Include real competitors and tangible market data.`;
    }

    /**
     * Build prompt for financial projections
     */
    static buildFinancialProjectionsPrompt(ideaTitle: string, budget: string): string {
        return `Create detailed financial projections for this business:

Business: ${ideaTitle}
Available Budget: ${budget}

Generate comprehensive financial projections in this JSON format:
\`\`\`json
{
  "startupCosts": [
    { "category": "Equipment", "amount": 0, "description": "specific items" },
    { "category": "Licenses & Permits", "amount": 0, "description": "specific details" },
    { "category": "Marketing", "amount": 0, "description": "specific channels" },
    { "category": "Working Capital", "amount": 0, "description": "specific needs" },
    { "category": "Other", "amount": 0, "description": "other costs" }
  ],
  "revenueProjections": {
    "labels": ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"],
    "yearOne": [quarter1, quarter2, quarter3, quarter4, 0, 0],
    "yearTwo": [0, 0, 0, 0, yearTwoH1, yearTwoH2],
    "yearThree": [yearThreeRevenue, 0, 0, 0, 0, 0]
  },
  "expenseModel": {
    "fixedCosts": [
      { "category": "Rent", "monthly": 0 },
      { "category": "Salaries", "monthly": 0 },
      { "category": "Utilities", "monthly": 0 },
      { "category": "Insurance", "monthly": 0 }
    ],
    "variableCosts": [
      { "category": "Materials", "perUnit": 0 },
      { "category": "Shipping", "perUnit": 0 }
    ]
  },
  "breakEvenAnalysis": {
    "breakEvenPoint": 0,
    "timeToBreakEven": "X months",
    "monthlySalesNeeded": 0
  },
  "metrics": {
    "grossMargin": 0.0,
    "netMargin": 0.0,
    "roi": 0.0,
    "paybackPeriod": "X years"
  },
  "pricingStrategy": "Detailed pricing strategy description"
}
\`\`\`

Use realistic numbers based on industry standards. Ensure all calculations are mathematically sound.`;
    }

    /**
     * Build prompt for marketing strategy
     */
    static buildMarketingStrategyPrompt(ideaTitle: string, businessModel: string): string {
        return `Develop a comprehensive marketing strategy for:

Business: ${ideaTitle}
Model: ${businessModel}

Provide detailed marketing strategy in JSON format:
\`\`\`json
{
  "channels": [
    {
      "name": "Channel name",
      "description": "How it will be used",
      "estimatedCost": "monthly cost",
      "expectedROI": "expected return"
    }
  ],
  "brandPositioning": "Clear brand positioning statement",
  "customerAcquisition": "Detailed acquisition strategy",
  "budgetAllocation": [
    { "channel": "Digital Ads", "percentage": 30 },
    { "channel": "Content Marketing", "percentage": 25 },
    { "channel": "Social Media", "percentage": 20 },
    { "channel": "SEO", "percentage": 15 },
    { "channel": "Other", "percentage": 10 }
  ],
  "socialMediaStrategy": "Specific social media approach",
  "seoSemRecommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "retentionTactics": ["tactic 1", "tactic 2", "tactic 3"]
}
\`\`\``;
    }

    /**
     * Build prompt for operations plan
     */
    static buildOperationsPlanPrompt(ideaTitle: string, industry: string): string {
        return `Create a detailed operations plan for:

Business: ${ideaTitle}
Industry: ${industry}

Provide JSON formatted operations plan:
\`\`\`json
{
  "workflow": "Step-by-step operational workflow description",
  "supplyChain": "Supply chain structure and logistics",
  "technologyRequirements": ["requirement 1", "requirement 2", "requirement 3"],
  "qualityControl": "Quality control processes",
  "scalingRoadmap": ["phase 1", "phase 2", "phase 3"],
  "automationOpportunities": ["opportunity 1", "opportunity 2"],
  "vendorRequirements": ["requirement 1", "requirement 2"]
}
\`\`\``;
    }

    /**
     * Build prompt for legal compliance
     */
    static buildLegalCompliancePrompt(ideaTitle: string, industry: string, location: string): string {
        return `Provide legal and compliance information for:

Business: ${ideaTitle}
Industry: ${industry}
Location: ${location}

Generate JSON formatted compliance guide:
\`\`\`json
{
  "recommendedStructure": "LLC, Corporation, etc. with reasoning",
  "licensesPermits": ["license 1", "license 2", "license 3"],
  "insuranceRequirements": ["insurance type 1", "insurance type 2"],
  "ipProtection": ["IP consideration 1", "IP consideration 2"],
  "complianceCalendar": [
    { "item": "File business registration", "deadline": "Month 1" },
    { "item": "Obtain permits", "deadline": "Month 2" }
  ],
  "employmentLaw": ["consideration 1", "consideration 2", "consideration 3"]
}
\`\`\`

Provide location-specific guidance where possible.`;
    }
}
