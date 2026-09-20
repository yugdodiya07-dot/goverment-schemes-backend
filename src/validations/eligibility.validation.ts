import { z } from 'zod';

export const eligibilityCheckSchema = z.object({
  body: z.object({
    age: z.number().min(0).max(120),
    gender: z.string().optional(),
    annualIncome: z.number().min(0),
    state: z.string().optional(),
    occupation: z.string().optional(),
    category: z.string().optional(),
    disabilityStatus: z.boolean().optional(),
    specialStatus: z.array(z.string()).optional(),
  }),
});
