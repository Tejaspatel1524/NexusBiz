import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

/**
 * AI Chat - Vercel Serverless Function
 * Matches frontend route: POST /api/ai/ollama/chat
 * 
 * Returns proper SSE format for frontend parsing
 */

const log = (msg: string) => console.log(`[OllamaChat] ${new Date().toISOString()}: ${msg}`);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { conversationId, message, context } = req.body || {};
    log(`Chat request for conversation: ${conversationId}`);

    if (!message) {
        // Return SSE error format
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        return res.send(`data: ${JSON.stringify({ type: 'error', message: 'Message is required' })}\n\n`);
    }

    // Initialize Groq client
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        return res.send(`data: ${JSON.stringify({ type: 'error', message: 'GROQ_API_KEY not configured' })}\n\n`);
    }

    const groq = new Groq({ apiKey: groqApiKey });

    // Build context-aware system prompt
    let systemPrompt = `You are NexusBiz AI, an expert business consultant helping entrepreneurs build successful businesses. 
    
When providing business analysis, be:
- Comprehensive and detailed
- Use clear formatting with headers (**bold**), bullet points, and numbered lists
- Include specific numbers, metrics, and timelines
- Be actionable and practical
- Use professional business terminology`;

    if (context?.idea) {
        systemPrompt += `\n\nBusiness Context: "${context.idea.title}" - ${context.idea.description}`;
    }

    try {
        log('Calling Groq API for chat...');

        const completion = await groq.chat.completions.create({
            model: (process.env.GROQ_MODEL || 'llama-3.1-8b-instant').trim(),
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 4096,
        });

        const response = completion.choices[0]?.message?.content || '';
        log(`Chat response length: ${response.length}`);

        if (!response || response.length === 0) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            return res.send(`data: ${JSON.stringify({ type: 'error', message: 'AI returned empty response' })}\n\n`);
        }

        // Send SSE format that frontend expects
        // Using res.send() instead of res.write() for Vercel compatibility
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sseResponse = `data: ${JSON.stringify({ type: 'chunk', chunk: response })}\n\ndata: ${JSON.stringify({ type: 'done' })}\n\n`;
        return res.send(sseResponse);

    } catch (error: any) {
        log(`Error: ${error.message}`);
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        return res.send(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    }
}
