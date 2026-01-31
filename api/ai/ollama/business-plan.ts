import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

/**
 * Business Plan Generator - Vercel Serverless Function
 * Matches frontend route: POST /api/ai/ollama/business-plan
 */

const log = (msg: string) => console.log(`[BusinessPlan] ${new Date().toISOString()}: ${msg}`);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { idea, userInputs } = req.body || {};
    log(`Business plan request for: ${idea?.title}`);

    if (!idea) {
        return res.status(400).json({ success: false, error: 'Idea is required' });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
        return res.status(500).json({
            success: false,
            error: 'GROQ_API_KEY not configured'
        });
    }

    const groq = new Groq({ apiKey: groqApiKey });

    const systemPrompt = `You are an expert business consultant. Generate comprehensive, actionable business plans with specific metrics, timelines, and strategies.`;

    const prompt = `Create a complete business plan for: "${idea.title}"
Description: ${idea.description}
Industry: ${idea.industry || userInputs?.industry || 'General'}
Budget: ${userInputs?.budgetMin || 50000} - ${userInputs?.budgetMax || 200000}

Include these sections:
1. **Executive Summary** - Mission, vision, key success factors
2. **Market Analysis** - Target market, competitors, positioning  
3. **Marketing Strategy** - Channels, tactics, budget allocation
4. **Financial Projections** - 3-year forecast, break-even analysis
5. **Operations Plan** - Processes, technology, team structure
6. **Risk Analysis** - Top risks and mitigation strategies

Be specific with numbers, dates, and actionable recommendations.`;

    try {
        log('Calling Groq API for business plan...');

        const completion = await groq.chat.completions.create({
            model: (process.env.GROQ_MODEL || 'llama3-8b-8192').trim(),
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4096,
        });

        const content = completion.choices[0]?.message?.content || '';
        log(`Business plan generated: ${content.length} chars`);

        // Return as SSE format for frontend
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');

        res.write(`data: ${JSON.stringify({ type: 'progress', message: 'Generating business plan...' })}\n\n`);
        res.write(`data: ${JSON.stringify({
            type: 'complete',
            data: {
                idea,
                marketAnalysis: { content },
                financials: { content: 'See full plan above for financial projections' },
                marketing: { content: 'See full plan above for marketing strategy' },
                operations: { content: 'See full plan above for operations plan' },
                riskAnalysis: { content: 'See full plan above for risk analysis' },
                fullPlan: content,
                generatedAt: new Date().toISOString()
            }
        })}\n\n`);
        res.end();

    } catch (error: any) {
        log(`Error: ${error.message}`);
        res.setHeader('Content-Type', 'text/event-stream');
        res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
        res.end();
    }
}
