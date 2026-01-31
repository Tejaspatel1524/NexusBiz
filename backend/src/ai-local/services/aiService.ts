import OllamaClient from './ollamaClient';
import GroqClient from './groqClient';
import { ModelRouter, TaskType } from './modelRouter';
import ConversationManager from './conversationManager';
import VectorStore from '../rag/vectorStore';
import ResponseCache from '../optimization/responseCache';
import logger from '../../middleware/logger';
import {
    buildIdeaGenerationPrompt,
    buildMarketAnalysisPrompt,
    buildFinancialProjectionsPrompt,
    buildMarketingStrategyPrompt,
    buildOperationsPlanPrompt,
    buildLegalCompliancePrompt,
    buildRiskAnalysisPrompt
} from '../prompts/businessPrompts';
import {
    BUSINESS_STRATEGIST_SYSTEM,
    MARKETING_EXPERT_SYSTEM,
    FINANCIAL_ANALYST_SYSTEM,
    OPERATIONS_CONSULTANT_SYSTEM,
    LEGAL_COMPLIANCE_EXPERT_SYSTEM,
    RISK_ANALYST_SYSTEM
} from '../prompts/systemPrompts';

/**
 * AI Provider type - supports Groq (cloud) and Ollama (local)
 */
type AIProvider = 'groq' | 'ollama' | 'auto';

/**
 * Main Local AI Service
 * Orchestrates all AI operations using Groq (cloud) or Ollama (local)
 */
class LocalAIService {
    private ollamaClient: OllamaClient;
    private groqClient: GroqClient | null = null;
    private modelRouter: ModelRouter;
    private conversationManager: ConversationManager;
    private vectorStore: VectorStore;
    private responseCache: ResponseCache;
    private initialized: boolean = false;
    private activeProvider: 'groq' | 'ollama' = 'ollama';

    constructor() {
        this.ollamaClient = new OllamaClient();

        // Initialize Groq if API key is available
        const groqApiKey = process.env.GROQ_API_KEY;
        const providerConfig = (process.env.AI_PROVIDER || 'auto') as AIProvider;

        if (groqApiKey && providerConfig !== 'ollama') {
            try {
                this.groqClient = new GroqClient({ apiKey: groqApiKey });
                this.activeProvider = 'groq';
                logger.info('Groq client initialized - using cloud AI');
            } catch (error) {
                logger.warn('Failed to initialize Groq, falling back to Ollama');
                this.groqClient = null;
                this.activeProvider = 'ollama';
            }
        } else {
            logger.info('No GROQ_API_KEY found - using Ollama local AI');
            this.activeProvider = 'ollama';
        }

        this.modelRouter = new ModelRouter(this.ollamaClient);
        this.conversationManager = new ConversationManager(
            this.ollamaClient,
            this.modelRouter
        );
        this.vectorStore = new VectorStore(this.ollamaClient);
        this.responseCache = new ResponseCache(3600000); // 1 hour cache

        logger.info(`Local AI Service created (provider: ${this.activeProvider})`);
    }

    /**
     * Initialize the service
     */
    async initialize(): Promise<void> {
        if (this.initialized) {
            logger.info('AI Service already initialized');
            return;
        }

        try {
            logger.info(`Initializing AI Service with provider: ${this.activeProvider}...`);

            // Check active provider health
            if (this.activeProvider === 'groq' && this.groqClient) {
                const isHealthy = await this.groqClient.healthCheck();
                if (!isHealthy) {
                    logger.warn('Groq health check failed, falling back to Ollama');
                    this.activeProvider = 'ollama';
                } else {
                    const models = await this.groqClient.listModels();
                    logger.info(`Groq available models: ${models.slice(0, 5).join(', ')}...`);
                }
            }

            // If using Ollama, check its health
            if (this.activeProvider === 'ollama') {
                const isHealthy = await this.ollamaClient.healthCheck();
                if (!isHealthy) {
                    throw new Error('Ollama is not running. Please start Ollama service.');
                }
                const models = await this.ollamaClient.listModels();
                logger.info(`Ollama available models: ${models.join(', ')}`);
            }

            this.initialized = true;
            logger.info(`AI Service initialized successfully (provider: ${this.activeProvider})`);
        } catch (error: any) {
            logger.error('Failed to initialize AI service:', error);
            throw error;
        }
    }

    /**
     * Generate business ideas
     */
    async generateIdeas(
        userInputs: any,
        onProgress?: (progress: string) => void
    ): Promise<any> {
        if (!this.initialized) {
            await this.initialize();
        }

        // Check cache first
        const cacheKey = JSON.stringify(userInputs);
        const cached = this.responseCache.get('idea_generation', cacheKey, 'llama3.2:latest');

        if (cached) {
            logger.info(' Returning cached ideas');
            onProgress?.('Loading cached results...');
            return JSON.parse(cached);
        }

        const prompt = buildIdeaGenerationPrompt(userInputs);

        try {
            onProgress?.('Analyzing your inputs and market conditions...');

            const response = await this.modelRouter.executeTask(
                TaskType.IDEA_GENERATION,
                prompt,
                BUSINESS_STRATEGIST_SYSTEM,
                {
                    format: 'json',
                    temperature: 0.8,
                    prioritize: 'speed' // Changed to speed for faster generation
                }
            );

            onProgress?.('Parsing and validating ideas...');

            // Log raw response for debugging
            logger.info(`Raw AI Response (first 500 chars): ${response?.substring(0, 500)}`);

            if (!response || response.trim().length === 0) {
                throw new Error('Empty response from AI');
            }

            // Try to parse JSON with better error handling
            let parsed;
            try {
                const cleaned = this.cleanJsonResponse(response);
                logger.info(`Cleaned response (first 300 chars): ${cleaned.substring(0, 300)}`);
                parsed = JSON.parse(cleaned);
            } catch (parseError: any) {
                logger.error(`JSON Parse Error: ${parseError.message}`);
                logger.error(`Raw response was: ${response.substring(0, 1000)}`);
                // Create a fallback response with the raw text
                parsed = {
                    ideas: [{
                        title: 'AI Generated Idea',
                        description: response.substring(0, 500),
                        industry: userInputs.industry || 'General',
                        businessModel: 'B2C',
                        initialInvestment: 50000,
                        viabilityScore: 70
                    }]
                };
            }

            // Log what we got from AI
            logger.info(`AI Response parsed successfully`);

            // Ensure we return the ideas array
            const ideas = Array.isArray(parsed) ? parsed : (parsed.ideas || [parsed]);

            logger.info(`Returning ${ideas.length} ideas to frontend`);

            // Cache the result
            this.responseCache.set(
                'idea_generation',
                cacheKey,
                'llama3.2:latest',
                JSON.stringify(ideas)
            );

            onProgress?.('Ideas generated successfully!');

            return ideas;

        } catch (error: any) {
            logger.error('Error generating ideas:', error.message);
            logger.error('Full error:', error);
            throw new Error(`Failed to generate ideas: ${error.message}`);
        }
    }

    /**
     * Generate market analysis
     */
    async generateMarketAnalysis(
        idea: any,
        userInputs: any,
        onProgress?: (progress: string) => void
    ): Promise<any> {
        if (!this.initialized) {
            await this.initialize();
        }

        const prompt = buildMarketAnalysisPrompt(idea, userInputs);

        try {
            onProgress?.('Analyzing target market...');

            const response = await this.modelRouter.executeTask(
                TaskType.MARKET_ANALYSIS,
                prompt,
                BUSINESS_STRATEGIST_SYSTEM,
                {
                    format: 'json',
                    temperature: 0.7,
                    prioritize: 'quality'
                }
            );

            onProgress?.('Market analysis complete!');

            return JSON.parse(this.cleanJsonResponse(response));

        } catch (error: any) {
            logger.error('Error in market analysis:', error);
            throw error;
        }
    }

    /**
     * Generate financial projections
     */
    async generateFinancialProjections(
        idea: any,
        marketAnalysis: any,
        onProgress?: (progress: string) => void
    ): Promise<any> {
        if (!this.initialized) {
            await this.initialize();
        }

        const prompt = buildFinancialProjectionsPrompt(idea, marketAnalysis);

        try {
            onProgress?.('Building financial model...');

            const response = await this.modelRouter.executeTask(
                TaskType.FINANCIAL_PROJECTIONS,
                prompt,
                FINANCIAL_ANALYST_SYSTEM,
                {
                    format: 'json',
                    temperature: 0.5, // Lower for more consistent numbers
                    prioritize: 'quality'
                }
            );

            onProgress?.('Financial projections complete!');

            return JSON.parse(this.cleanJsonResponse(response));

        } catch (error: any) {
            logger.error('Error in financial projections:', error);
            throw error;
        }
    }

    /**
     * Generate marketing strategy
     */
    async generateMarketingStrategy(
        idea: any,
        marketAnalysis: any,
        onProgress?: (progress: string) => void
    ): Promise<any> {
        if (!this.initialized) {
            await this.initialize();
        }

        const prompt = buildMarketingStrategyPrompt(idea, marketAnalysis);

        try {
            onProgress?.('Crafting marketing strategy...');

            const response = await this.modelRouter.executeTask(
                TaskType.MARKETING_STRATEGY,
                prompt,
                MARKETING_EXPERT_SYSTEM,
                {
                    format: 'json',
                    temperature: 0.7,
                    prioritize: 'quality'
                }
            );

            onProgress?.('Marketing strategy complete!');

            return JSON.parse(this.cleanJsonResponse(response));

        } catch (error: any) {
            logger.error('Error in marketing strategy:', error);
            throw error;
        }
    }

    /**
     * Generate operations plan
     */
    async generateOperationsPlan(
        idea: any,
        onProgress?: (progress: string) => void
    ): Promise<any> {
        if (!this.initialized) {
            await this.initialize();
        }

        const prompt = buildOperationsPlanPrompt(idea);

        try {
            onProgress?.('Designing operations plan...');

            const response = await this.modelRouter.executeTask(
                TaskType.OPERATIONS_PLANNING,
                prompt,
                OPERATIONS_CONSULTANT_SYSTEM,
                {
                    format: 'json',
                    temperature: 0.6,
                    prioritize: 'quality'
                }
            );

            onProgress?.('Operations plan complete!');

            return JSON.parse(this.cleanJsonResponse(response));

        } catch (error: any) {
            logger.error('Error in operations plan:', error);
            throw error;
        }
    }

    /**
     * Generate legal compliance checklist
     */
    async generateLegalCompliance(
        idea: any,
        location: string,
        onProgress?: (progress: string) => void
    ): Promise<any> {
        if (!this.initialized) {
            await this.initialize();
        }

        const prompt = buildLegalCompliancePrompt(idea, location);

        try {
            onProgress?.('Analyzing legal requirements...');

            const response = await this.modelRouter.executeTask(
                TaskType.LEGAL_COMPLIANCE,
                prompt,
                LEGAL_COMPLIANCE_EXPERT_SYSTEM,
                {
                    format: 'json',
                    temperature: 0.5,
                    prioritize: 'quality'
                }
            );

            onProgress?.('Legal compliance checklist complete!');

            return JSON.parse(this.cleanJsonResponse(response));

        } catch (error: any) {
            logger.error('Error in legal compliance:', error);
            throw error;
        }
    }

    /**
     * Generate risk analysis
     */
    async generateRiskAnalysis(
        idea: any,
        marketAnalysis: any,
        onProgress?: (progress: string) => void
    ): Promise<any> {
        if (!this.initialized) {
            await this.initialize();
        }

        const prompt = buildRiskAnalysisPrompt(idea, marketAnalysis);

        try {
            onProgress?.('Assessing risks...');

            const response = await this.modelRouter.executeTask(
                TaskType.RISK_ANALYSIS,
                prompt,
                RISK_ANALYST_SYSTEM,
                {
                    format: 'json',
                    temperature: 0.6,
                    prioritize: 'quality'
                }
            );

            onProgress?.('Risk analysis complete!');

            return JSON.parse(this.cleanJsonResponse(response));

        } catch (error: any) {
            logger.error('Error in risk analysis:', error);
            throw error;
        }
    }

    /**
     * Chat with assistant
     */
    async chat(
        conversationId: string,
        message: string,
        context?: any,
        streaming: boolean = false,
        onChunk?: (chunk: string) => void
    ): Promise<string> {
        if (!this.initialized) {
            await this.initialize();
        }

        // Set context if provided
        if (context) {
            this.conversationManager.setContext(conversationId, context);
        }

        return await this.conversationManager.sendMessage(
            conversationId,
            message,
            {
                streaming,
                onChunk
            }
        );
    }

    /**
     * Utility: Clean JSON response
     */
    private cleanJsonResponse(response: string): string {
        // Remove markdown code blocks
        let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        // Remove any text before first { or [
        const jsonStart = Math.min(
            cleaned.indexOf('{') >= 0 ? cleaned.indexOf('{') : Infinity,
            cleaned.indexOf('[') >= 0 ? cleaned.indexOf('[') : Infinity
        );

        if (jsonStart !== Infinity) {
            cleaned = cleaned.substring(jsonStart);
        }

        // Remove any text after last } or ]
        const jsonEnd = Math.max(
            cleaned.lastIndexOf('}'),
            cleaned.lastIndexOf(']')
        );

        if (jsonEnd >= 0) {
            cleaned = cleaned.substring(0, jsonEnd + 1);
        }

        return cleaned.trim();
    }

    /**
     * Get service statistics
     */
    getStats(): any {
        return {
            activeProvider: this.activeProvider,
            groq: this.groqClient ? {
                healthy: true,
                model: process.env.GROQ_MODEL || 'llama-3.2-3b-preview'
            } : null,
            ollama: {
                healthy: true,
                baseUrl: this.ollamaClient.getConfig().baseUrl
            },
            modelPerformance: this.modelRouter.getPerformanceStats(),
            cache: this.responseCache.getStats(),
            vectorStore: this.vectorStore.getStats(),
            initialized: this.initialized
        };
    }

    /**
     * Health check - checks active provider
     */
    async healthCheck(): Promise<boolean> {
        if (this.activeProvider === 'groq' && this.groqClient) {
            return await this.groqClient.healthCheck();
        }
        return await this.ollamaClient.healthCheck();
    }

    /**
     * Get active AI provider
     */
    getActiveProvider(): 'groq' | 'ollama' {
        return this.activeProvider;
    }
}

export default LocalAIService;

