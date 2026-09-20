"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemeCreateSchema = void 0;
const zod_1 = require("zod");
exports.schemeCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, 'Title must be at least 3 characters'),
        shortDescription: zod_1.z.string().min(10, 'Short description is required'),
        description: zod_1.z.string().min(20, 'Full description is required'),
        category: zod_1.z.string().min(1, 'Category is required'),
        ministry: zod_1.z.string().min(2, 'Ministry name is required'),
        benefitType: zod_1.z.enum(['Direct Benefit Transfer', 'Subsidy', 'Loan / Credit', 'Insurance', 'Skill Training', 'In-Kind Support']),
        financialBenefit: zod_1.z.string().min(1, 'Financial benefit information is required'),
        eligibilityCriteria: zod_1.z.object({
            minAge: zod_1.z.number().optional(),
            maxAge: zod_1.z.number().optional(),
            gender: zod_1.z.enum(['All', 'Male', 'Female', 'Transgender']).optional(),
            maxIncome: zod_1.z.number().optional(),
            eligibleStates: zod_1.z.array(zod_1.z.string()).optional(),
            eligibleOccupations: zod_1.z.array(zod_1.z.string()).optional(),
            eligibleCategories: zod_1.z.array(zod_1.z.string()).optional(),
            requiresDisability: zod_1.z.boolean().optional(),
            requiredSpecialStatus: zod_1.z.array(zod_1.z.string()).optional(),
        }),
        requiredDocuments: zod_1.z.array(zod_1.z.string()).optional(),
        applicationProcess: zod_1.z.array(zod_1.z.string()).optional(),
        officialUrl: zod_1.z.string().optional(),
        helplineNumber: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        status: zod_1.z.enum(['Active', 'Draft', 'Archived']).optional(),
    }),
});
//# sourceMappingURL=scheme.validation.js.map