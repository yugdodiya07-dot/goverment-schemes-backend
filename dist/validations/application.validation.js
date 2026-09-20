"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatusSchema = exports.submitApplicationSchema = void 0;
const zod_1 = require("zod");
exports.submitApplicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        schemeId: zod_1.z.string().min(1, 'Scheme ID is required'),
        formData: zod_1.z.record(zod_1.z.any()),
        documents: zod_1.z.array(zod_1.z.object({
            documentName: zod_1.z.string(),
            documentType: zod_1.z.string().default('PDF'),
            fileUrl: zod_1.z.string(),
        })).default([]),
        eligibilityScore: zod_1.z.number().min(0).max(100).optional(),
    }),
});
exports.updateApplicationStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['Submitted', 'Under Review', 'Document Verification', 'Approved', 'Rejected']),
        comment: zod_1.z.string().default(''),
    }),
});
//# sourceMappingURL=application.validation.js.map