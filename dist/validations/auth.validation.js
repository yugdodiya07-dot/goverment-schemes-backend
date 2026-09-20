"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Please enter a valid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        phone: zod_1.z.string().min(10, 'Mobile number must be at least 10 digits'),
        age: zod_1.z.number().min(0).max(120).optional(),
        gender: zod_1.z.enum(['Male', 'Female', 'Transgender', 'Other']).optional(),
        state: zod_1.z.string().optional(),
        annualIncome: zod_1.z.number().optional(),
        occupation: zod_1.z.string().optional(),
        category: zod_1.z.enum(['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority']).optional(),
        disabilityStatus: zod_1.z.boolean().optional(),
        specialStatus: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Please enter a valid email address'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
//# sourceMappingURL=auth.validation.js.map