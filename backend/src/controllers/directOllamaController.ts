import { Request, Response } from 'express';
import axios from 'axios';

/**
 * DIRECT OLLAMA CONTROLLER - Simple REST, no SSE streaming
 * Maximum reliability for idea generation
 */

const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'llama3.2:latest';

const log = (msg: string) => console.log(`[DirectOllama] ${new Date().toISOString()}: ${msg}`);

/**
 * Generate business ideas - SIMPLE REST endpoint (no SSE)
 */
export const directGenerateIdeasSimple = async (req: Request, res: Response): Promise<void> => {
    const userInputs = req.body;
    log(`Received request for industry: ${userInputs.industry}`);

    const prompt = `Generate 2 business ideas for ${userInputs.industry || 'technology'}.
Budget: $${userInputs.budgetMin || 50000}-$${userInputs.budgetMax || 200000}
Location: ${userInputs.location || 'USA'}

Return ONLY valid JSON: {"ideas":[{"title":"Name","description":"Brief description","industry":"${userInputs.industry || 'Tech'}","businessModel":"B2C","initialInvestment":50000,"viabilityScore":80,"timelineMonths":6,"targetMarket":"Target audience"}]}`;

    try {
        log('Calling Ollama...');

        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: MODEL,
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.7,
                num_ctx: 512,  // DRASTICALLY reduced for speed
                num_predict: 300  // Shorter output
            }
        }, {
            timeout: 30000  // 30 seconds max - hardware limitation
        });

        log('Ollama responded');
        const rawResponse = response.data.response;
        log(`Raw: ${rawResponse?.substring(0, 100)}`);

        let ideas = [];
        try {
            const jsonMatch = rawResponse.match(/\{[\s\S]*"ideas"[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                ideas = parsed.ideas || [parsed];
            } else {
                ideas = [{
                    title: `${userInputs.industry || 'Business'} Venture`,
                    description: rawResponse.substring(0, 200).trim(),
                    industry: userInputs.industry || 'General',
                    businessModel: 'B2C',
                    initialInvestment: userInputs.budgetMin || 50000,
                    viabilityScore: 75,
                    timelineMonths: 6,
                    targetMarket: 'General consumers'
                }];
            }
        } catch {
            log('JSON parse failed, using fallback');
            ideas = [{
                title: `${userInputs.industry || 'Business'} Opportunity`,
                description: rawResponse?.substring(0, 200)?.trim() || 'AI-generated business opportunity',
                industry: userInputs.industry || 'General',
                businessModel: 'B2C',
                initialInvestment: userInputs.budgetMin || 50000,
                viabilityScore: 75,
                timelineMonths: 6,
                targetMarket: 'General consumers'
            }];
        }

        log(`Returning ${ideas.length} ideas as JSON`);
        res.json({ success: true, ideas });

    } catch (error: any) {
        log(`Error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: error.message,
            ideas: []
        });
    }
};

/**
 * Health check
 */
export const directHealth = async (_req: Request, res: Response): Promise<void> => {
    try {
        await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
        res.json({ status: 'ok', model: MODEL });
    } catch {
        res.status(503).json({ status: 'error' });
    }
};
