/**
 * ULTRA-MINIMAL Business Prompts - Fastest possible generation
 */

export const buildIdeaGenerationPrompt = (userInputs: any) => {
  return `Generate 2 ${userInputs.industry || 'business'} ideas. Budget $${userInputs.budgetMin || 50000}.
Return JSON: {"ideas":[{"title":"name","description":"brief","industry":"${userInputs.industry || 'Tech'}","businessModel":"B2C","initialInvestment":50000,"viabilityScore":80}]}`;
};

export const buildMarketAnalysisPrompt = (idea: any, _userInputs: any) => {
  return `Market analysis for ${idea.title}. Return JSON: {"targetMarketDefinition":"market","marketSize":{"description":"size"},"competitiveLandscape":{"competitionLevel":"moderate"},"uniqueValueProposition":"value"}`;
};

export const buildFinancialProjectionsPrompt = (idea: any, _marketAnalysis: any) => {
  return `Financials for ${idea.title}. Return JSON: {"startupCosts":{"total":${idea.initialInvestment || 50000}},"breakEvenAnalysis":{"estimatedMonthsToBreakEven":8},"keyMetrics":{"year1":{"totalRevenue":100000}}}`;
};

export const buildMarketingStrategyPrompt = (idea: any, _marketAnalysis: any) => {
  return `Marketing for ${idea.title}. Return JSON: {"brandPositioning":{"brandMessage":"message"},"marketingChannels":[{"channel":"Social","priority":"high"}]}`;
};

export const buildOperationsPlanPrompt = (idea: any) => {
  return `Operations for ${idea.title}. Return JSON: {"operationalStructure":{"businessStructure":"LLC"},"keyProcesses":[{"processName":"Sales"}]}`;
};

export const buildLegalCompliancePrompt = (idea: any, location: string) => {
  return `Legal for ${idea.title} in ${location}. Return JSON: {"businessRegistration":{"recommendedStructure":"LLC"},"disclaimer":"Consult lawyer."}`;
};

export const buildRiskAnalysisPrompt = (idea: any, _marketAnalysis: any) => {
  return `Risks for ${idea.title}. Return JSON: {"riskCategories":[{"category":"Market","risks":[{"risk":"Competition","mitigation":"Differentiate"}]}]}`;
};
