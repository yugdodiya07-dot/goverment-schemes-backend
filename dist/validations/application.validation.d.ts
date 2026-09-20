import { z } from 'zod';
export declare const submitApplicationSchema: z.ZodObject<{
    body: z.ZodObject<{
        schemeId: z.ZodString;
        formData: z.ZodRecord<z.ZodString, z.ZodAny>;
        documents: z.ZodDefault<z.ZodArray<z.ZodObject<{
            documentName: z.ZodString;
            documentType: z.ZodDefault<z.ZodString>;
            fileUrl: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            documentName: string;
            documentType: string;
            fileUrl: string;
        }, {
            documentName: string;
            fileUrl: string;
            documentType?: string | undefined;
        }>, "many">>;
        eligibilityScore: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        schemeId: string;
        formData: Record<string, any>;
        documents: {
            documentName: string;
            documentType: string;
            fileUrl: string;
        }[];
        eligibilityScore?: number | undefined;
    }, {
        schemeId: string;
        formData: Record<string, any>;
        documents?: {
            documentName: string;
            fileUrl: string;
            documentType?: string | undefined;
        }[] | undefined;
        eligibilityScore?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        schemeId: string;
        formData: Record<string, any>;
        documents: {
            documentName: string;
            documentType: string;
            fileUrl: string;
        }[];
        eligibilityScore?: number | undefined;
    };
}, {
    body: {
        schemeId: string;
        formData: Record<string, any>;
        documents?: {
            documentName: string;
            fileUrl: string;
            documentType?: string | undefined;
        }[] | undefined;
        eligibilityScore?: number | undefined;
    };
}>;
export declare const updateApplicationStatusSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodEnum<["Submitted", "Under Review", "Document Verification", "Approved", "Rejected"]>;
        comment: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "Submitted" | "Under Review" | "Document Verification" | "Approved" | "Rejected";
        comment: string;
    }, {
        status: "Submitted" | "Under Review" | "Document Verification" | "Approved" | "Rejected";
        comment?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        status: "Submitted" | "Under Review" | "Document Verification" | "Approved" | "Rejected";
        comment: string;
    };
}, {
    body: {
        status: "Submitted" | "Under Review" | "Document Verification" | "Approved" | "Rejected";
        comment?: string | undefined;
    };
}>;
