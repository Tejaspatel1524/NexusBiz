import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

/**
 * AI Chat - Vercel Serverless Function
 * Uses Groq API for cloud AI chat
 */

const log = (msg: string) => console.log(`[Chat] ${new Date().toISOString()}: ${msg}`);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { conversationId, message, context } = req.body || {};
    log(`Chat request for conversation: ${conversationId}`);

    if (!message) {
        return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Initialize Groq client
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
        return res.status(500).json({
            success: false,
            error: 'GROQ_API_KEY not configured'
        });
    }

    const groq = new Groq({ apiKey: groqApiKey });

    // Build context-aware system prompt
    let systemPrompt = 'You are NexusBiz AI, an expert business consultant helping entrepreneurs build successful businesses. Be concise, practical, and actionable.';

    if (context?.idea) {
        systemPrompt += `\n\nCurrent business idea: ${context.idea.title} - ${context.idea.description}`;
    }
    if (context?.businessPlan) {
        systemPrompt += '\n\nThe user has a business plan in progress.';
    }

    try {
        log('Calling Groq API for chat...');

        const completion = await groq.chat.completions.create({
            model: (process.env.GROQ_MODEL || 'llama3-8b-8192').trim(),
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const response = completion.choices[0]?.message?.content || '';
        log(`Chat response length: ${response.length}`);

        return res.status(200).json({
            success: true,
            response,
            conversationId: conversationId || `conv-${Date.now()}`
        });

    } catch (error: any) {
        log(`Error: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: error.message || 'Chat failed'
        });
    }
}
