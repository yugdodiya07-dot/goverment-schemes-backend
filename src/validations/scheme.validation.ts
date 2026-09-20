import { z } from 'zod';

export const schemeCreateSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    shortDescription: z.string().min(10, 'Short description is required'),
    description: z.string().min(20, 'Full description is required'),
    category: z.string().min(1, 'Category is required'),
    ministry: z.string().min(2, 'Ministry name is required'),
    benefitType: z.enum(['Direct Benefit Transfer', 'Subsidy', 'Loan / Credit', 'Insurance', 'Skill Training', 'In-Kind Support']),
    financialBenefit: z.string().min(1, 'Financial benefit information is required'),
    eligibilityCriteria: z.object({
      minAge: z.number().optional(),
      maxAge: z.number().optional(),
      gender: z.enum(['All', 'Male', 'Female', 'Transgender']).optional(),
      maxIncome: z.number().optional(),
      eligibleStates: z.array(z.string()).optional(),
      eligibleOccupations: z.array(z.string()).optional(),
      eligibleCategories: z.array(z.string()).optional(),
      requiresDisability: z.boolean().optional(),
      requiredSpecialStatus: z.array(z.string()).optional(),
    }),
    requiredDocuments: z.array(z.string()).optional(),
    applicationProcess: z.array(z.string()).optional(),
    officialUrl: z.string().optional(),
    helplineNumber: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['Active', 'Draft', 'Archived']).optional(),
  }),
});
