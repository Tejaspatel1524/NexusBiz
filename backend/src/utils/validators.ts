import { z } from 'zod';

/**
 * Zod schemas for request validation
 */

export const UserInputSchema = z.object({
    industry: z.enum([
        'Technology',
        'Healthcare',
        'Finance',
        'Education',
        'Retail',
        'Manufacturing',
        'Energy',
        'Transportation',
        'Entertainment',
        'Real Estate',
        'Food & Beverage',
        'Aerospace',
        'Agriculture',
        'Construction',
        'Hospitality',
        'Media',
        'Telecommunications',
        'E-commerce',
        'Automotive',
        'Pharmaceuticals',
    ]),
    budget: z.enum(['$0-$10k', '$10k-$50k', '$50k-$100k', '$100k-$500k', '$500k+']),
    location: z.string().min(2).max(100),
    timeline: z.enum(['3 months', '6 months', '1 year', '2+ years']),
    skills: z.array(z.string()).min(1),
    resources: z.object({
        team: z.boolean(),
        office: z.boolean(),
        equipment: z.boolean(),
        funding: z.boolean(),
    }),
    riskTolerance: z.enum(['Low', 'Medium', 'High']),
    businessModel: z.enum(['B2B', 'B2C', 'B2B2C', 'Marketplace', 'SaaS', 'E-commerce', 'Services']),
    marketSize: z.enum(['Local', 'Regional', 'National', 'International']),
    innovationLevel: z.enum(['Incremental', 'Moderate', 'Disruptive']),
});

export const BusinessPlanRequestSchema = z.object({
    ideaId: z.string().optional(),
    idea: z
        .object({
            title: z.string(),
            description: z.string(),
            industry: z.string(),
        })
        .optional(),
    userInput: z
        .object({
            budget: z.string(),
            businessModel: z.string(),
            location: z.string(),
        })
        .optional(),
});
