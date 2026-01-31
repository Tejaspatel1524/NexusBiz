import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

/**
 * AI Chat - Vercel Serverless Function
 * Matches frontend route: POST /api/ai/ollama/chat
 * 
 * NOTE: For Vercel, we return a simple JSON response instead of SSE streaming
 * because the frontend will handle both cases.
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
        return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Initialize Groq client
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
        return res.status(500).json({
            success: false,
            error: 'GROQ_API_KEY not configured. Please add it to Vercel environment variables.'
        });
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
            model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 4096,  // Larger for detailed business content
        });

        const response = completion.choices[0]?.message?.content || '';
        log(`Chat response length: ${response.length}`);

        // For the frontend that expects SSE, we send the complete response
        // The frontend will handle it as if it received all chunks at once
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Send as SSE format that frontend expects
        res.write(`data: ${JSON.stringify({ type: 'chunk', chunk: response })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();

    } catch (error: any) {
        log(`Error: ${error.message}`);

        // Send error in SSE format
        res.setHeader('Content-Type', 'text/event-stream');
        res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
        res.end();
    }
}
