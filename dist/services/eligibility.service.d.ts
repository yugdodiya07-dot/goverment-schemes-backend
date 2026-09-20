import { IEligibilityCriteria, IWeightedScoreResult } from '../types/index.js';
export declare class EligibilityService {
    /**
     * Evaluates a user profile against scheme criteria using an 8-Factor Weighted Model.
     * Total Weight = 100%
     * - Age (20%)
     * - Income (20%)
     * - Occupation (20%)
     * - Gender (10%)
     * - State (10%)
     * - Social Category (10%)
     * - Disability Status (5%)
     * - Special Status (5%)
     */
    static calculateMatch(profile: Record<string, any>, criteria: IEligibilityCriteria): IWeightedScoreResult;
    /**
     * Batch evaluates all active schemes for a given user profile.
     */
    static evaluateAllSchemes(profile: Record<string, any>): Promise<{
        scheme: import("mongoose").Document<unknown, {}, import("../models/Scheme.js").IScheme, {}, {}> & import("../models/Scheme.js").IScheme & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        score: number;
        isEligible: boolean;
        breakdown: {
            age: {
                score: number;
                max: number;
                passed: boolean;
            };
            income: {
                score: number;
                max: number;
                passed: boolean;
            };
            occupation: {
                score: number;
                max: number;
                passed: boolean;
            };
            gender: {
                score: number;
                max: number;
                passed: boolean;
            };
            state: {
                score: number;
                max: number;
                passed: boolean;
            };
            category: {
                score: number;
                max: number;
                passed: boolean;
            };
            disability: {
                score: number;
                max: number;
                passed: boolean;
            };
            specialStatus: {
                score: number;
                max: number;
                passed: boolean;
            };
        };
        matchedRules: string[];
        unmatchedRules: string[];
    }[]>;
    /**
     * Validates profile for statutory consistency and real-world conflicts.
     */
    static validateProfileConsistency(profile: Record<string, any>): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    };
}
