import { z } from 'zod';

export const submitApplicationSchema = z.object({
  body: z.object({
    schemeId: z.string().min(1, 'Scheme ID is required'),
    formData: z.record(z.any()),
    documents: z.array(
      z.object({
        documentName: z.string(),
        documentType: z.string().default('PDF'),
        fileUrl: z.string(),
      })
    ).default([]),
    eligibilityScore: z.number().min(0).max(100).optional(),
  }),
});

export const updateApplicationStatusSchema = z.object({
  body: z.object({
    status: z.enum(['Submitted', 'Under Review', 'Document Verification', 'Approved', 'Rejected']),
    comment: z.string().default(''),
  }),
});
