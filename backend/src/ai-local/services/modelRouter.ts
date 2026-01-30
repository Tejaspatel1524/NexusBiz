import OllamaClient from './ollamaClient';
import logger from '../../middleware/logger';
import { TaskType, ModelCapability, PerformanceStats } from '../types/ollamaTypes';

/**
 * Intelligent Model Router
 * Routes tasks to the most appropriate model based on task type,
 * performance requirements, and model capabilities
 */
class ModelRouter {
    private ollamaClient: OllamaClient;
    private modelCapabilities: ModelCapability[];
    private performanceStats: Map<string, PerformanceStats>;

    constructor(ollamaClient: OllamaClient) {
        this.ollamaClient = ollamaClient;
        this.performanceStats = new Map();

        // Define model capabilities - using llama3.2 as primary model
        this.modelCapabilities = [
            {
                model: 'llama3.2:latest',
                tasks: [
                    TaskType.IDEA_GENERATION,
                    TaskType.MARKET_ANALYSIS,
                    TaskType.MARKETING_STRATEGY,
                    TaskType.COMPLEX_REASONING,
                    TaskType.QUICK_CHAT,
                    TaskType.CONTENT_REFINEMENT,
                    TaskType.OPERATIONS_PLANNING,
                    TaskType.IMPLEMENTATION_TIMELINE,
                    TaskType.FINANCIAL_PROJECTIONS,
                    TaskType.RISK_ANALYSIS,
                    TaskType.LEGAL_COMPLIANCE,
                    TaskType.CODE_GENERATION,
                    TaskType.TECHNOLOGY_REQUIREMENTS,
                    TaskType.HR_PLANNING
                ],
                contextWindow: 128000,
                speedTier: 'fast',
                qualityTier: 'high',
                description: 'Primary model for all business tasks'
            }
        ];

        logger.info(`Model router initialized with ${this.modelCapabilities.length} models`);
    }

    /**
     * Select best model for a task
     */
    selectModel(
        taskType: TaskType,
        prioritize: 'speed' | 'quality' = 'quality',
        requiredContextSize?: number
    ): string {
        // Filter models that can handle this task
        let candidateModels = this.modelCapabilities.filter(
            m => m.tasks.includes(taskType)
        );

        // Filter by context window if required
        if (requiredContextSize) {
            candidateModels = candidateModels.filter(
                m => m.contextWindow >= requiredContextSize
            );
        }

        if (candidateModels.length === 0) {
            logger.warn(`No suitable model for task ${taskType}, using default`);
            return 'llama3.2:latest';
        }

        // Sort based on priority
        if (prioritize === 'speed') {
            candidateModels.sort((a, b) => {
                const speedOrder = { fast: 0, medium: 1, slow: 2 };
                return speedOrder[a.speedTier] - speedOrder[b.speedTier];
            });
        } else {
            candidateModels.sort((a, b) => {
                const qualityOrder = { high: 0, medium: 1, low: 2 };
                return qualityOrder[a.qualityTier] - qualityOrder[b.qualityTier];
            });
        }

        const selectedModel = candidateModels[0].model;
        logger.debug(`Selected ${selectedModel} for ${taskType} (prioritize: ${prioritize})`);

        return selectedModel;
    }

    /**
     * Execute task with best model
     */
    async executeTask(
        taskType: TaskType,
        prompt: string,
        systemPrompt?: string,
        options?: {
            prioritize?: 'speed' | 'quality';
            format?: 'json';
            temperature?: number;
            streaming?: boolean;
            onChunk?: (chunk: string) => void;
            streamId?: string;
        }
    ): Promise<string> {
        const model = this.selectModel(
            taskType,
            options?.prioritize || 'quality'
        );

        logger.info(`Executing ${taskType} with model: ${model}`);

        const startTime = Date.now();

        try {
            let result: string;

            if (options?.streaming && options.onChunk) {
                let fullResponse = '';

                await this.ollamaClient.generateStream(
                    {
                        model,
                        prompt,
                        system: systemPrompt,
                        format: options.format,
                        options: {
                            temperature: options.temperature || 0.7,
                            num_ctx: 2048
                        }
                    },
                    options.onChunk,
                    (response) => { fullResponse = response; },
                    options.streamId
                );

                result = fullResponse;
            } else {
                result = await this.ollamaClient.generate({
                    model,
                    prompt,
                    system: systemPrompt,
                    format: options?.format,
                    options: {
                        temperature: options?.temperature || 0.7,
                        num_ctx: 2048
                    }
                });
            }

            // Track performance
            const duration = Date.now() - startTime;
            this.updatePerformanceStats(model, duration, true);

            logger.info(`Task ${taskType} completed in ${duration}ms`);

            return result;

        } catch (error: any) {
            const duration = Date.now() - startTime;
            this.updatePerformanceStats(model, duration, false);

            logger.error(`Task ${taskType} failed:`, error);
            throw error;
        }
    }

    /**
     * Update performance statistics
     */
    private updatePerformanceStats(
        model: string,
        duration: number,
        success: boolean
    ): void {
        const stats = this.performanceStats.get(model) || {
            avgTime: 0,
            successRate: 1,
            totalRequests: 0
        };

        const totalRequests = stats.totalRequests + 1;
        const avgTime = ((stats.avgTime * stats.totalRequests) + duration) / totalRequests;
        const successRate = success
            ? ((stats.successRate * stats.totalRequests) + 1) / totalRequests
            : ((stats.successRate * stats.totalRequests)) / totalRequests;

        this.performanceStats.set(model, {
            avgTime,
            successRate,
            totalRequests
        });
    }

    /**
     * Get performance statistics
     */
    getPerformanceStats(): Record<string, PerformanceStats> {
        const stats: Record<string, PerformanceStats> = {};
        this.performanceStats.forEach((value, key) => {
            stats[key] = value;
        });
        return stats;
    }

    /**
     * Get model capabilities
     */
    getModelCapabilities(): ModelCapability[] {
        return [...this.modelCapabilities];
    }
}

export { ModelRouter, TaskType };
export default ModelRouter;
