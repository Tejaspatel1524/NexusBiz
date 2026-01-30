import axios, { AxiosInstance } from 'axios';
import logger from '../../middleware/logger';
import {
    OllamaConfig,
    OllamaRequest,
    OllamaResponse,
    OllamaStreamResponse,
    OllamaChatRequest,
    OllamaChatResponse,
    OllamaEmbeddingRequest,
    OllamaEmbeddingResponse,
    OllamaModelsResponse
} from '../types/ollamaTypes';

/**
 * Ollama Client for local LLM interactions
 * Handles non-streaming, streaming, chat, and embedding requests
 */
class OllamaClient {
    private config: OllamaConfig;
    private client: AxiosInstance;
    private activeStreams: Map<string, AbortController>;

    constructor(config: Partial<OllamaConfig> = {}) {
        this.config = {
            baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
            defaultModel: process.env.OLLAMA_DEFAULT_MODEL || 'llama3.2:latest',
            timeout: 300000, // 5 minutes for generations (slow hardware)
            maxRetries: 2,
            temperature: 0.7,
            streamingEnabled: true,
            ...config
        };

        this.client = axios.create({
            baseURL: this.config.baseUrl,
            timeout: this.config.timeout,
            headers: { 'Content-Type': 'application/json' }
        });

        this.activeStreams = new Map();
        logger.info(`Ollama client initialized: ${this.config.baseUrl}, model: ${this.config.defaultModel}`);
    }

    /**
     * Non-streaming generation
     */
    async generate(request: Partial<OllamaRequest>): Promise<string> {
        const fullRequest: OllamaRequest = {
            model: request.model || this.config.defaultModel,
            prompt: request.prompt!,
            system: request.system,
            stream: false,
            format: request.format,
            options: {
                temperature: request.options?.temperature || this.config.temperature,
                num_ctx: request.options?.num_ctx || 2048,
                top_p: request.options?.top_p || 0.9,
                top_k: request.options?.top_k || 40,
                repeat_penalty: request.options?.repeat_penalty || 1.1,
                ...request.options
            }
        };

        try {
            logger.debug(`Generating with model: ${fullRequest.model}`);
            const response = await this.client.post<OllamaResponse>(
                '/api/generate',
                fullRequest
            );

            logger.info(`Generation complete: ${response.data.eval_count} tokens`);
            return response.data.response;
        } catch (error: any) {
            logger.error('Ollama generation error:', error);
            throw new Error(`Ollama generation failed: ${error.message}`);
        }
    }

    /**
     * Streaming generation with callback
     */
    async generateStream(
        request: Partial<OllamaRequest>,
        onChunk: (chunk: string) => void,
        onComplete?: (fullResponse: string) => void,
        streamId?: string
    ): Promise<void> {
        const id = streamId || `stream-${Date.now()}`;
        const abortController = new AbortController();
        this.activeStreams.set(id, abortController);

        const fullRequest: OllamaRequest = {
            model: request.model || this.config.defaultModel,
            prompt: request.prompt!,
            system: request.system,
            stream: true,
            format: request.format,
            options: {
                temperature: request.options?.temperature || this.config.temperature,
                num_ctx: request.options?.num_ctx || 8192,
                ...request.options
            }
        };

        let fullResponse = '';

        try {
            logger.debug(`Starting stream with model: ${fullRequest.model}`);

            const response = await this.client.post(
                '/api/generate',
                fullRequest,
                {
                    responseType: 'stream',
                    signal: abortController.signal
                }
            );

            response.data.on('data', (chunk: Buffer) => {
                const lines = chunk.toString().split('\n').filter(line => line.trim());

                for (const line of lines) {
                    try {
                        const parsed: OllamaStreamResponse = JSON.parse(line);

                        if (parsed.response) {
                            fullResponse += parsed.response;
                            onChunk(parsed.response);
                        }

                        if (parsed.done) {
                            logger.info(`Stream complete: ${parsed.eval_count} tokens`);
                            if (onComplete) {
                                onComplete(fullResponse);
                            }
                        }
                    } catch (e) {
                        logger.error('Error parsing stream chunk:', e);
                    }
                }
            });

            response.data.on('end', () => {
                this.activeStreams.delete(id);
                logger.debug(`Stream ${id} ended`);
            });

            response.data.on('error', (error: Error) => {
                logger.error('Stream error:', error);
                this.activeStreams.delete(id);
            });

        } catch (error: any) {
            this.activeStreams.delete(id);
            if (error.name === 'CanceledError') {
                logger.info('Stream canceled by user');
            } else {
                logger.error('Streaming error:', error);
                throw error;
            }
        }
    }

    /**
     * Cancel an active stream
     */
    cancelStream(streamId: string): void {
        const controller = this.activeStreams.get(streamId);
        if (controller) {
            controller.abort();
            this.activeStreams.delete(streamId);
            logger.info(`Stream ${streamId} canceled`);
        }
    }

    /**
     * Chat completion (multi-turn conversation)
     */
    async chat(
        messages: Array<{ role: string; content: string }>,
        model?: string
    ): Promise<string> {
        const request: OllamaChatRequest = {
            model: model || this.config.defaultModel,
            messages: messages.map(m => ({
                role: m.role as 'system' | 'user' | 'assistant',
                content: m.content
            })),
            stream: false,
            options: {
                temperature: this.config.temperature,
                num_ctx: 8192
            }
        };

        try {
            logger.debug(`Chat request with ${messages.length} messages`);
            const response = await this.client.post<OllamaChatResponse>(
                '/api/chat',
                request
            );

            return response.data.message.content;
        } catch (error: any) {
            logger.error('Chat error:', error);
            throw new Error(`Chat failed: ${error.message}`);
        }
    }

    /**
     * Generate embeddings for RAG
     */
    async embeddings(
        text: string,
        model: string = 'llama3.1:8b'
    ): Promise<number[]> {
        const request: OllamaEmbeddingRequest = {
            model,
            prompt: text
        };

        try {
            logger.debug(`Generating embeddings with ${model}`);
            const response = await this.client.post<OllamaEmbeddingResponse>(
                '/api/embeddings',
                request
            );

            return response.data.embedding;
        } catch (error: any) {
            logger.error('Embeddings error:', error);
            throw error;
        }
    }

    /**
     * List available models
     */
    async listModels(): Promise<string[]> {
        try {
            const response = await this.client.get<OllamaModelsResponse>('/api/tags');
            const models = response.data.models.map(m => m.name);
            logger.info(`Available models: ${models.join(', ')}`);
            return models;
        } catch (error: any) {
            logger.error('List models error:', error);
            return [];
        }
    }

    /**
     * Check if Ollama is running and healthy
     */
    async healthCheck(): Promise<boolean> {
        try {
            await this.client.get('/api/tags', { timeout: 5000 });
            logger.info('Ollama health check: OK');
            return true;
        } catch (error) {
            logger.error('Ollama health check: FAILED');
            return false;
        }
    }

    /**
     * Pull a model if not available
     */
    async pullModel(modelName: string): Promise<void> {
        logger.info(`Pulling model: ${modelName}...`);

        try {
            await this.client.post('/api/pull', {
                name: modelName,
                stream: false
            });

            logger.info(`Model ${modelName} pulled successfully`);
        } catch (error: any) {
            logger.error(`Failed to pull model ${modelName}:`, error);
            throw error;
        }
    }

    /**
     * Get configuration
     */
    getConfig(): OllamaConfig {
        return { ...this.config };
    }
}

export default OllamaClient;
