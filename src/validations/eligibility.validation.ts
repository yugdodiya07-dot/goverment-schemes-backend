import { z } from 'zod';

export const eligibilityCheckSchema = z.object({
  body: z.object({
    age: z.number().min(1, 'Applicant age must be at least 1 completed year').max(115, 'Applicant age cannot exceed 115 years'),
    gender: z.string().optional(),
    annualIncome: z.number().min(0),
    state: z.string().optional(),
    occupation: z.string().optional(),
    category: z.string().optional(),
    disabilityStatus: z.boolean().optional(),
    specialStatus: z.array(z.string()).optional(),
  }),
});
