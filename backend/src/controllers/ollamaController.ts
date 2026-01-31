import { Request, Response } from 'express';
import LocalAIService from '../ai-local/services/aiService';
import logger from '../middleware/logger';

// Initialize the AI service (singleton)
const aiService = new LocalAIService();

// Initialize on server start (async)
aiService.initialize().catch((error) => {
    logger.error('Failed to initialize AI service on startup:', error);
});

/**
 * Generate business ideas using Ollama
 * POST /api/ai/ollama/generate-ideas
 */
export const generateIdeas = async (req: Request, res: Response): Promise<void> => {
    try {
        const userInputs = req.body;

        // Validate inputs
        if (!userInputs.industry) {
            res.status(400).json({
                success: false,
                error: 'Missing required field: industry'
            });
            return;
        }

        logger.info(`Generating ideas for industry: ${userInputs.industry}`);

        // Track connection state to prevent writing to closed connections
        let connectionClosed = false;

        req.on('close', () => {
            connectionClosed = true;
            logger.info(`Client disconnected during idea generation`);
        });

        // Use SSE for progress updates
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

        const sendProgress = (message: string) => {
            if (!connectionClosed && !res.writableEnded) {
                res.write(`data: ${JSON.stringify({ type: 'progress', message })}\n\n`);
            }
        };

        try {
            const ideas = await aiService.generateIdeas(userInputs, sendProgress);

            if (!connectionClosed && !res.writableEnded) {
                res.write(`data: ${JSON.stringify({ type: 'complete', data: ideas })}\n\n`);
                res.end();
            }
        } catch (error: any) {
            logger.error('Error generating ideas:', error);
            if (!connectionClosed && !res.writableEnded) {
                res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
                res.end();
            }
        }

    } catch (error: any) {
        logger.error('Error in generateIdeas controller:', error);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: 'Failed to generate ideas'
            });
        }
    }
};

/**
 * Generate full business plan using Ollama
 * POST /api/ai/ollama/business-plan
 */
export const generateBusinessPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idea, userInputs } = req.body;

        if (!idea || !userInputs) {
            res.status(400).json({
                success: false,
                error: 'Missing required fields: idea and userInputs'
            });
            return;
        }

        logger.info(`Generating business plan for: ${idea.title}`);

        // Track connection state to prevent writing to closed connections
        let connectionClosed = false;

        req.on('close', () => {
            connectionClosed = true;
            logger.info(`Client disconnected during business plan generation`);
        });

        // Use SSE for progress updates
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        const sendProgress = (message: string) => {
            if (!connectionClosed && !res.writableEnded) {
                res.write(`data: ${JSON.stringify({ type: 'progress', message })}\n\n`);
            }
        };

        try {
            // Generate each section
            sendProgress('Generating market analysis...');
            const marketAnalysis = await aiService.generateMarketAnalysis(
                idea,
                userInputs,
                sendProgress
            );

            sendProgress('Creating financial projections...');
            const financials = await aiService.generateFinancialProjections(
                idea,
                marketAnalysis,
                sendProgress
            );

            sendProgress('Developing marketing strategy...');
            const marketing = await aiService.generateMarketingStrategy(
                idea,
                marketAnalysis,
                sendProgress
            );

            sendProgress('Designing operations plan...');
            const operations = await aiService.generateOperationsPlan(
                idea,
                sendProgress
            );

            sendProgress('Analyzing legal compliance...');
            const legalCompliance = await aiService.generateLegalCompliance(
                idea,
                userInputs.location || 'United States',
                sendProgress
            );

            sendProgress('Assessing risks...');
            const riskAnalysis = await aiService.generateRiskAnalysis(
                idea,
                marketAnalysis,
                sendProgress
            );

            const businessPlan = {
                idea,
                marketAnalysis,
                financials,
                marketing,
                operations,
                legalCompliance,
                riskAnalysis,
                generatedAt: new Date().toISOString()
            };

            if (!connectionClosed && !res.writableEnded) {
                res.write(`data: ${JSON.stringify({ type: 'complete', data: businessPlan })}\n\n`);
                res.end();
            }

        } catch (error: any) {
            logger.error('Error generating business plan:', error);
            if (!connectionClosed && !res.writableEnded) {
                res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
                res.end();
            }
        }

    } catch (error: any) {
        logger.error('Error in generateBusinessPlan controller:', error);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: 'Failed to generate business plan'
            });
        }
    }
};

/**
 * Chat with AI assistant using Ollama
 * POST /api/ai/ollama/chat
 */
export const chat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { conversationId, message, context, streaming = true } = req.body;

        if (!conversationId || !message) {
            res.status(400).json({
                success: false,
                error: 'Missing required fields: conversationId and message'
            });
            return;
        }

        logger.info(`Chat message in conversation: ${conversationId}`);

        if (streaming) {
            // Track connection state to prevent writing to closed connections
            let connectionClosed = false;

            req.on('close', () => {
                connectionClosed = true;
                logger.info(`Client disconnected from conversation: ${conversationId}`);
            });

            // Use SSE for streaming response
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('X-Accel-Buffering', 'no');

            try {
                await aiService.chat(
                    conversationId,
                    message,
                    context,
                    true,
                    (chunk: string) => {
                        if (!connectionClosed && !res.writableEnded) {
                            res.write(`data: ${JSON.stringify({ type: 'chunk', chunk })}\n\n`);
                        }
                    }
                );

                if (!connectionClosed && !res.writableEnded) {
                    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
                    res.end();
                }

            } catch (error: any) {
                logger.error('Chat error:', error);
                if (!connectionClosed && !res.writableEnded) {
                    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
                    res.end();
                }
            }

        } else {
            // Non-streaming response
            try {
                const response = await aiService.chat(conversationId, message, context, false);

                res.json({
                    success: true,
                    response
                });

            } catch (error: any) {
                logger.error('Chat error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Chat failed'
                });
            }
        }

    } catch (error: any) {
        logger.error('Error in chat controller:', error);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: 'Chat request failed'
            });
        }
    }
};

/**
 * Get AI service statistics
 * GET /api/ai/ollama/stats
 */
export const getServiceStats = async (_req: Request, res: Response): Promise<void> => {
    try {
        const stats = aiService.getStats();

        res.json({
            success: true,
            stats
        });

    } catch (error: any) {
        logger.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get stats'
        });
    }
};

/**
 * Health check for Ollama service
 * GET /api/ai/ollama/health
 */
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
    try {
        const isHealthy = await aiService.healthCheck();

        res.json({
            success: true,
            healthy: isHealthy,
            status: isHealthy ? 'running' : 'offline'
        });

    } catch (error: any) {
        logger.error('Health check error:', error);
        res.status(500).json({
            success: false,
            healthy: false,
            status: 'error'
        });
    }
};
