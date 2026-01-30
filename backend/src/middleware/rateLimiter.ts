import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for idea generation endpoint
 */
export const ideaGenerationLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    max: 10,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many idea generation requests. Please try again later.',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter for business plan generation endpoint
 */
export const businessPlanLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    max: 5,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many business plan requests. Please try again later.',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * General rate limiter for other endpoints
 */
export const generalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    max: 100,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
