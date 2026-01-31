import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

/**
 * Simple Generate Ideas - Vercel Serverless Function
 * Matches existing frontend route: POST /api/ai/ollama/simple-generate-ideas
 */

const log = (msg: string) => console.log(`[SimpleGenerateIdeas] ${new Date().toISOString()}: ${msg}`);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const userInputs = req.body || {};
    log(`Request for industry: ${userInputs.industry}`);

    // Initialize Groq client
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
        return res.status(500).json({
            success: false,
            error: 'GROQ_API_KEY not configured. Please add it to Vercel environment variables.',
            ideas: []
        });
    }

    const groq = new Groq({ apiKey: groqApiKey });

    const prompt = `You are a business strategist. Generate 3 innovative business ideas for the ${userInputs.industry || 'technology'} industry.

Budget Range: $${userInputs.budgetMin || 50000} - $${userInputs.budgetMax || 200000}
Location: ${userInputs.location || 'USA'}
Timeline: ${userInputs.timelineMonths || 12} months

Return ONLY valid JSON in this exact format:
{"ideas":[{"title":"Business Name","description":"Detailed description of the business idea","industry":"${userInputs.industry || 'Technology'}","businessModel":"B2C","initialInvestment":50000,"viabilityScore":85,"timelineMonths":6,"targetMarket":"Target customer segment","uniqueValue":"What makes this unique"}]}

Generate exactly 3 unique ideas. Be creative and specific.`;

    try {
        log('Calling Groq API...');

        const completion = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert business strategist. Always respond with valid JSON only, no markdown or extra text.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
            max_tokens: 2048,
        });

        log('Groq responded');
        const rawResponse = completion.choices[0]?.message?.content || '';
        log(`Raw response length: ${rawResponse.length}`);

        let ideas = [];
        try {
            // Try to parse JSON from response
            const jsonMatch = rawResponse.match(/\{[\s\S]*"ideas"[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                ideas = parsed.ideas || [parsed];
            } else {
                // Try direct parse
                const parsed = JSON.parse(rawResponse);
                ideas = parsed.ideas || [parsed];
            }
        } catch {
            log('JSON parse failed, creating fallback ideas');
            ideas = [{
                title: `${userInputs.industry || 'Business'} Innovation`,
                description: rawResponse.substring(0, 300).trim() || 'AI-generated business opportunity in your chosen industry.',
                industry: userInputs.industry || 'General',
                businessModel: 'B2C',
                initialInvestment: userInputs.budgetMin || 50000,
                viabilityScore: 75,
                timelineMonths: 6,
                targetMarket: 'General consumers',
                uniqueValue: 'Innovative approach to solving market needs'
            }];
        }

        // Ensure all ideas have required fields
        ideas = ideas.map((idea: any, index: number) => ({
            id: `idea-${Date.now()}-${index}`,
            title: idea.title || `Business Idea ${index + 1}`,
            description: idea.description || 'AI-generated business opportunity',
            industry: idea.industry || userInputs.industry || 'General',
            businessModel: idea.businessModel || 'B2C',
            initialInvestment: idea.initialInvestment || 50000,
            viabilityScore: idea.viabilityScore || 75,
            timelineMonths: idea.timelineMonths || 6,
            targetMarket: idea.targetMarket || 'General audience',
            uniqueValue: idea.uniqueValue || 'Unique value proposition'
        }));

        log(`Returning ${ideas.length} ideas`);
        return res.status(200).json({ success: true, ideas });

    } catch (error: any) {
        log(`Error: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: error.message || 'AI generation failed',
            ideas: []
        });
    }
}
