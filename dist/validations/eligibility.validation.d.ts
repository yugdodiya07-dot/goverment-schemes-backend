import { z } from 'zod';
export declare const eligibilityCheckSchema: z.ZodObject<{
    body: z.ZodObject<{
        age: z.ZodNumber;
        gender: z.ZodOptional<z.ZodString>;
        annualIncome: z.ZodNumber;
        state: z.ZodOptional<z.ZodString>;
        occupation: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        disabilityStatus: z.ZodOptional<z.ZodBoolean>;
        specialStatus: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        age: number;
        annualIncome: number;
        gender?: string | undefined;
        state?: string | undefined;
        occupation?: string | undefined;
        category?: string | undefined;
        disabilityStatus?: boolean | undefined;
        specialStatus?: string[] | undefined;
    }, {
        age: number;
        annualIncome: number;
        gender?: string | undefined;
        state?: string | undefined;
        occupation?: string | undefined;
        category?: string | undefined;
        disabilityStatus?: boolean | undefined;
        specialStatus?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        age: number;
        annualIncome: number;
        gender?: string | undefined;
        state?: string | undefined;
        occupation?: string | undefined;
        category?: string | undefined;
        disabilityStatus?: boolean | undefined;
        specialStatus?: string[] | undefined;
    };
}, {
    body: {
        age: number;
        annualIncome: number;
        gender?: string | undefined;
        state?: string | undefined;
        occupation?: string | undefined;
        category?: string | undefined;
        disabilityStatus?: boolean | undefined;
        specialStatus?: string[] | undefined;
    };
}>;
