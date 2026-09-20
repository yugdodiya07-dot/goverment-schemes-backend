"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eligibilityCheckSchema = void 0;
const zod_1 = require("zod");
exports.eligibilityCheckSchema = zod_1.z.object({
    body: zod_1.z.object({
        age: zod_1.z.number().min(1, 'Applicant age must be at least 1 completed year').max(115, 'Applicant age cannot exceed 115 years'),
        gender: zod_1.z.string().optional(),
        annualIncome: zod_1.z.number().min(0),
        state: zod_1.z.string().optional(),
        occupation: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        disabilityStatus: zod_1.z.boolean().optional(),
        specialStatus: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
//# sourceMappingURL=eligibility.validation.js.map