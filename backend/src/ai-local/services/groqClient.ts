import Groq from 'groq-sdk';
import logger from '../../middleware/logger';

/**
 * Groq Configuration
 */
interface GroqConfig {
    apiKey: string;
    defaultModel: string;
    timeout: number;
    temperature: number;
}

/**
 * Groq Client for cloud LLM interactions
 * Provides same interface as OllamaClient for easy switching
 */
class GroqClient {
    private config: GroqConfig;
    private client: Groq;

    constructor(config: Partial<GroqConfig> = {}) {
        const apiKey = config.apiKey || process.env.GROQ_API_KEY;

        if (!apiKey) {
            throw new Error('GROQ_API_KEY is required for GroqClient');
        }

        this.config = {
            apiKey,
            defaultModel: config.defaultModel || 'llama-3.2-3b-preview',
            timeout: config.timeout || 60000,
            temperature: config.temperature || 0.7,
            ...config
        };

        this.client = new Groq({
            apiKey: this.config.apiKey,
        });

        logger.info(`Groq client initialized with model: ${this.config.defaultModel}`);
    }

    /**
     * Non-streaming generation (mimics Ollama generate)
     */
    async generate(request: {
        prompt: string;
        system?: string;
        model?: string;
        options?: { temperature?: number };
    }): Promise<string> {
        const messages: Groq.Chat.ChatCompletionMessageParam[] = [];

        if (request.system) {
            messages.push({ role: 'system', content: request.system });
        }
        messages.push({ role: 'user', content: request.prompt });

        try {
            logger.debug(`Groq generating with model: ${request.model || this.config.defaultModel}`);

            const completion = await this.client.chat.completions.create({
                model: request.model || this.config.defaultModel,
                messages,
                temperature: request.options?.temperature || this.config.temperature,
                max_tokens: 4096,
            });

            const response = completion.choices[0]?.message?.content || '';
            logger.info(`Groq generation complete: ${response.length} chars`);
            return response;
        } catch (error: any) {
            logger.error('Groq generation error:', error);
            throw new Error(`Groq generation failed: ${error.message}`);
        }
    }

    /**
     * Chat completion (multi-turn conversation)
     */
    async chat(
        messages: Array<{ role: string; content: string }>,
        model?: string
    ): Promise<string> {
        try {
            logger.debug(`Groq chat request with ${messages.length} messages`);

            const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = messages.map(m => ({
                role: m.role as 'system' | 'user' | 'assistant',
                content: m.content
            }));

            const completion = await this.client.chat.completions.create({
                model: model || this.config.defaultModel,
                messages: groqMessages,
                temperature: this.config.temperature,
                max_tokens: 4096,
            });

            return completion.choices[0]?.message?.content || '';
        } catch (error: any) {
            logger.error('Groq chat error:', error);
            throw new Error(`Groq chat failed: ${error.message}`);
        }
    }

    /**
     * Check if Groq API is reachable
     */
    async healthCheck(): Promise<boolean> {
        try {
            await this.client.models.list();
            logger.info('Groq health check: OK');
            return true;
        } catch (error) {
            logger.error('Groq health check: FAILED');
            return false;
        }
    }

    /**
     * List available models
     */
    async listModels(): Promise<string[]> {
        try {
            const response = await this.client.models.list();
            const models = response.data.map(m => m.id);
            logger.info(`Groq available models: ${models.join(', ')}`);
            return models;
        } catch (error: any) {
            logger.error('Groq list models error:', error);
            return [];
        }
    }

    /**
     * Get configuration
     */
    getConfig(): GroqConfig {
        return { ...this.config };
    }
}

export default GroqClient;
