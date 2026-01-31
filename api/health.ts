import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Health check endpoint for Vercel
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            provider: 'vercel-serverless',
        },
    });
}
