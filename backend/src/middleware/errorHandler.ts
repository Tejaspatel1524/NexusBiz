import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from './logger';

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof AppError) {
        logger.error(`AppError: ${err.message}`, {
            code: err.code,
            statusCode: err.statusCode,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });

        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
            },
        });
    } else {
        logger.error(`Unexpected Error: ${err.message}`, {
            stack: err.stack,
            path: req.path,
            method: req.method,
        });

        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: process.env.NODE_ENV === 'production'
                    ? 'An unexpected error occurred'
                    : err.message,
            },
        });
    }
};
