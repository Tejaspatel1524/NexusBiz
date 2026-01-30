import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Middleware factory for Zod schema validation
 */
export const validateRequest = (schema: ZodSchema) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error: any) {
            next(new ValidationError('Invalid request data'));
        }
    };
};
