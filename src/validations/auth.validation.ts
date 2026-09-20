import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().min(10, 'Mobile number must be at least 10 digits'),
    age: z.number().min(0).max(120).optional(),
    gender: z.enum(['Male', 'Female', 'Transgender', 'Other']).optional(),
    state: z.string().optional(),
    annualIncome: z.number().optional(),
    occupation: z.string().optional(),
    category: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority']).optional(),
    disabilityStatus: z.boolean().optional(),
    specialStatus: z.array(z.string()).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
