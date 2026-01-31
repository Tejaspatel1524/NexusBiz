import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

/**
 * AI Ollama Health Check - Vercel Serverless Function
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
        return res.status(200).json({
            success: true,
            healthy: false,
            status: 'GROQ_API_KEY not configured'
        });
    }

    try {
        const groq = new Groq({ apiKey: groqApiKey });
        await groq.models.list();

        return res.status(200).json({
            success: true,
            healthy: true,
            status: 'running',
            provider: 'groq'
        });
    } catch (error: any) {
        return res.status(200).json({
            success: true,
            healthy: false,
            status: error.message
        });
    }
}
