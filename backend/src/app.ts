import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ideaRoutes from './routes/ideaRoutes';
import businessPlanRoutes from './routes/businessPlanRoutes';
import ollamaRoutes from './routes/ollamaRoutes';
import authRoutes from './routes/authRoutes'; // NEW: Authentication routes
import ideaController from './controllers/ideaController';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import logger from './middleware/logger';

/**
 * Express application setup
 */
const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        credentials: true,
    })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        },
    });
});

// API routes
app.use('/api/ideas', ideaRoutes);
app.use('/api/business-plan', businessPlanRoutes);
app.use('/api/ai/ollama', ollamaRoutes);
app.use('/api/auth', authRoutes); // NEW: Authentication routes

// Industries endpoint
app.get('/api/industries', generalLimiter, ideaController.getIndustries.bind(ideaController));

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Route not found',
        },
    });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
