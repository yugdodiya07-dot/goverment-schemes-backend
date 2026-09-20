import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        phone: z.ZodString;
        age: z.ZodOptional<z.ZodNumber>;
        gender: z.ZodOptional<z.ZodEnum<["Male", "Female", "Transgender", "Other"]>>;
        state: z.ZodOptional<z.ZodString>;
        annualIncome: z.ZodOptional<z.ZodNumber>;
        occupation: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodEnum<["General", "OBC", "SC", "ST", "EWS", "Minority"]>>;
        disabilityStatus: z.ZodOptional<z.ZodBoolean>;
        specialStatus: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
        password: string;
        phone: string;
        age?: number | undefined;
        gender?: "Male" | "Female" | "Transgender" | "Other" | undefined;
        state?: string | undefined;
        annualIncome?: number | undefined;
        occupation?: string | undefined;
        category?: "General" | "OBC" | "SC" | "ST" | "EWS" | "Minority" | undefined;
        disabilityStatus?: boolean | undefined;
        specialStatus?: string[] | undefined;
    }, {
        name: string;
        email: string;
        password: string;
        phone: string;
        age?: number | undefined;
        gender?: "Male" | "Female" | "Transgender" | "Other" | undefined;
        state?: string | undefined;
        annualIncome?: number | undefined;
        occupation?: string | undefined;
        category?: "General" | "OBC" | "SC" | "ST" | "EWS" | "Minority" | undefined;
        disabilityStatus?: boolean | undefined;
        specialStatus?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        email: string;
        password: string;
        phone: string;
        age?: number | undefined;
        gender?: "Male" | "Female" | "Transgender" | "Other" | undefined;
        state?: string | undefined;
        annualIncome?: number | undefined;
        occupation?: string | undefined;
        category?: "General" | "OBC" | "SC" | "ST" | "EWS" | "Minority" | undefined;
        disabilityStatus?: boolean | undefined;
        specialStatus?: string[] | undefined;
    };
}, {
    body: {
        name: string;
        email: string;
        password: string;
        phone: string;
        age?: number | undefined;
        gender?: "Male" | "Female" | "Transgender" | "Other" | undefined;
        state?: string | undefined;
        annualIncome?: number | undefined;
        occupation?: string | undefined;
        category?: "General" | "OBC" | "SC" | "ST" | "EWS" | "Minority" | undefined;
        disabilityStatus?: boolean | undefined;
        specialStatus?: string[] | undefined;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
