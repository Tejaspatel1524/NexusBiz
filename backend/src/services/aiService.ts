import Anthropic from '@anthropic-ai/sdk';
import { AI_CONFIG } from '../config/constants';
import { AIServiceError } from '../utils/errors';
import logger from '../middleware/logger';

/**
 * AI Service for interacting with Anthropic Claude API
 * Note: This service is optional - use Ollama local AI service instead
 */
class AIService {
    private client: Anthropic | null = null;
    private requestCount: number = 0;

    constructor() {
        const apiKey = process.env.ANTHROPIC_API_KEY;

        if (!apiKey || apiKey === 'your_api_key_here') {
            logger.warn('ANTHROPIC_API_KEY not set - using Ollama local AI instead');
            this.client = null;
        } else {
            this.client = new Anthropic({ apiKey });
        }
    }

    /**
     * Generate text completion with retry logic
     */
    async generateCompletion(prompt: string, systemPrompt?: string): Promise<string> {
        if (!this.client) {
            throw new AIServiceError('Anthropic client not initialized - use Ollama local AI instead');
        }

        let attempts = 0;
        const maxAttempts = AI_CONFIG.retryAttempts;

        while (attempts < maxAttempts) {
            try {
                this.requestCount++;
                logger.info(`AI API request #${this.requestCount}`, { attempt: attempts + 1 });

                const message = await this.client.messages.create({
                    model: AI_CONFIG.model,
                    max_tokens: AI_CONFIG.maxTokens,
                    temperature: AI_CONFIG.temperature,
                    system: systemPrompt,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                });

                const content = message.content[0];
                if (content.type === 'text') {
                    logger.info('AI API response successful', {
                        tokens: message.usage,
                        model: message.model,
                    });
                    return content.text;
                }

                throw new AIServiceError('Unexpected response format from AI');
            } catch (error: any) {
                attempts++;
                logger.error(`AI API error (attempt ${attempts}/${maxAttempts})`, {
                    error: error.message,
                    stack: error.stack,
                });

                if (attempts >= maxAttempts) {
                    throw new AIServiceError(
                        `Failed to generate AI response after ${maxAttempts} attempts: ${error.message}`
                    );
                }

                // Exponential backoff
                await this.sleep(AI_CONFIG.retryDelay * Math.pow(2, attempts - 1));
            }
        }

        throw new AIServiceError('Failed to generate AI response');
    }

    /**
     * Generate JSON completion with validation
     */
    async generateJSONCompletion<T>(prompt: string, systemPrompt?: string): Promise<T> {
        const response = await this.generateCompletion(prompt, systemPrompt);

        try {
            // Extract JSON from code blocks if present
            const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
            const jsonString = jsonMatch ? jsonMatch[1] : response;

            return JSON.parse(jsonString.trim()) as T;
        } catch (error) {
            logger.error('Failed to parse AI JSON response', { response });
            throw new AIServiceError('AI response was not valid JSON');
        }
    }

    /**
     * Sleep utility for retry logic
     */
    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Get request count (for monitoring)
     */
    getRequestCount(): number {
        return this.requestCount;
    }
}

export default new AIService();
