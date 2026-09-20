import { z } from 'zod';
export declare const schemeCreateSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        shortDescription: z.ZodString;
        description: z.ZodString;
        category: z.ZodString;
        ministry: z.ZodString;
        benefitType: z.ZodEnum<["Direct Benefit Transfer", "Subsidy", "Loan / Credit", "Insurance", "Skill Training", "In-Kind Support"]>;
        financialBenefit: z.ZodString;
        eligibilityCriteria: z.ZodObject<{
            minAge: z.ZodOptional<z.ZodNumber>;
            maxAge: z.ZodOptional<z.ZodNumber>;
            gender: z.ZodOptional<z.ZodEnum<["All", "Male", "Female", "Transgender"]>>;
            maxIncome: z.ZodOptional<z.ZodNumber>;
            eligibleStates: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            eligibleOccupations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            eligibleCategories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            requiresDisability: z.ZodOptional<z.ZodBoolean>;
            requiredSpecialStatus: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            gender?: "All" | "Male" | "Female" | "Transgender" | undefined;
            minAge?: number | undefined;
            maxAge?: number | undefined;
            maxIncome?: number | undefined;
            eligibleStates?: string[] | undefined;
            eligibleOccupations?: string[] | undefined;
            eligibleCategories?: string[] | undefined;
            requiresDisability?: boolean | undefined;
            requiredSpecialStatus?: string[] | undefined;
        }, {
            gender?: "All" | "Male" | "Female" | "Transgender" | undefined;
            minAge?: number | undefined;
            maxAge?: number | undefined;
            maxIncome?: number | undefined;
            eligibleStates?: string[] | undefined;
            eligibleOccupations?: string[] | undefined;
            eligibleCategories?: string[] | undefined;
            requiresDisability?: boolean | undefined;
            requiredSpecialStatus?: string[] | undefined;
        }>;
        requiredDocuments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        applicationProcess: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        officialUrl: z.ZodOptional<z.ZodString>;
        helplineNumber: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        status: z.ZodOptional<z.ZodEnum<["Active", "Draft", "Archived"]>>;
    }, "strip", z.ZodTypeAny, {
        category: string;
        description: string;
        title: string;
        shortDescription: string;
        ministry: string;
        benefitType: "Direct Benefit Transfer" | "Subsidy" | "Loan / Credit" | "Insurance" | "Skill Training" | "In-Kind Support";
        financialBenefit: string;
        eligibilityCriteria: {
            gender?: "All" | "Male" | "Female" | "Transgender" | undefined;
            minAge?: number | undefined;
            maxAge?: number | undefined;
            maxIncome?: number | undefined;
            eligibleStates?: string[] | undefined;
            eligibleOccupations?: string[] | undefined;
            eligibleCategories?: string[] | undefined;
            requiresDisability?: boolean | undefined;
            requiredSpecialStatus?: string[] | undefined;
        };
        status?: "Active" | "Draft" | "Archived" | undefined;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        officialUrl?: string | undefined;
        helplineNumber?: string | undefined;
        tags?: string[] | undefined;
    }, {
        category: string;
        description: string;
        title: string;
        shortDescription: string;
        ministry: string;
        benefitType: "Direct Benefit Transfer" | "Subsidy" | "Loan / Credit" | "Insurance" | "Skill Training" | "In-Kind Support";
        financialBenefit: string;
        eligibilityCriteria: {
            gender?: "All" | "Male" | "Female" | "Transgender" | undefined;
            minAge?: number | undefined;
            maxAge?: number | undefined;
            maxIncome?: number | undefined;
            eligibleStates?: string[] | undefined;
            eligibleOccupations?: string[] | undefined;
            eligibleCategories?: string[] | undefined;
            requiresDisability?: boolean | undefined;
            requiredSpecialStatus?: string[] | undefined;
        };
        status?: "Active" | "Draft" | "Archived" | undefined;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        officialUrl?: string | undefined;
        helplineNumber?: string | undefined;
        tags?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        category: string;
        description: string;
        title: string;
        shortDescription: string;
        ministry: string;
        benefitType: "Direct Benefit Transfer" | "Subsidy" | "Loan / Credit" | "Insurance" | "Skill Training" | "In-Kind Support";
        financialBenefit: string;
        eligibilityCriteria: {
            gender?: "All" | "Male" | "Female" | "Transgender" | undefined;
            minAge?: number | undefined;
            maxAge?: number | undefined;
            maxIncome?: number | undefined;
            eligibleStates?: string[] | undefined;
            eligibleOccupations?: string[] | undefined;
            eligibleCategories?: string[] | undefined;
            requiresDisability?: boolean | undefined;
            requiredSpecialStatus?: string[] | undefined;
        };
        status?: "Active" | "Draft" | "Archived" | undefined;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        officialUrl?: string | undefined;
        helplineNumber?: string | undefined;
        tags?: string[] | undefined;
    };
}, {
    body: {
        category: string;
        description: string;
        title: string;
        shortDescription: string;
        ministry: string;
        benefitType: "Direct Benefit Transfer" | "Subsidy" | "Loan / Credit" | "Insurance" | "Skill Training" | "In-Kind Support";
        financialBenefit: string;
        eligibilityCriteria: {
            gender?: "All" | "Male" | "Female" | "Transgender" | undefined;
            minAge?: number | undefined;
            maxAge?: number | undefined;
            maxIncome?: number | undefined;
            eligibleStates?: string[] | undefined;
            eligibleOccupations?: string[] | undefined;
            eligibleCategories?: string[] | undefined;
            requiresDisability?: boolean | undefined;
            requiredSpecialStatus?: string[] | undefined;
        };
        status?: "Active" | "Draft" | "Archived" | undefined;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        officialUrl?: string | undefined;
        helplineNumber?: string | undefined;
        tags?: string[] | undefined;
    };
}>;
