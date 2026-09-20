export interface ISchemeSeed {
    title: string;
    slug: string;
    categorySlug: string;
    ministry: string;
    department: string;
    shortDescription: string;
    description: string;
    benefitType: 'Direct Benefit Transfer' | 'Subsidy' | 'Loan / Credit' | 'Insurance' | 'Skill Training' | 'In-Kind Support';
    financialBenefit: string;
    eligibilityCriteria: {
        minAge: number;
        maxAge: number;
        gender: 'All' | 'Male' | 'Female' | 'Transgender';
        maxIncome: number;
        eligibleStates: string[];
        eligibleOccupations: string[];
        eligibleCategories: string[];
        requiresDisability: boolean;
        requiredSpecialStatus: string[];
    };
    requiredDocuments: string[];
    applicationProcess: string[];
    officialUrl: string;
    helplineNumber: string;
    tags: string[];
}
export declare const schemesData: ISchemeSeed[];
