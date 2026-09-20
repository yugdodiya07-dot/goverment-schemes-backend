import { Request } from 'express';
import { Types } from 'mongoose';
export type UserRole = 'citizen' | 'admin' | 'officer';
export type UserStatus = 'Active' | 'Blocked' | 'Deleted';
export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Document Verification' | 'Approved' | 'Rejected';
export interface IUserPayload {
    _id: Types.ObjectId | string;
    id?: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    status: UserStatus;
    department?: string;
}
export interface AuthenticatedRequest extends Request {
    user?: IUserPayload;
}
export interface IEligibilityCriteria {
    minAge?: number;
    maxAge?: number;
    gender?: 'All' | 'Male' | 'Female' | 'Transgender';
    maxIncome?: number;
    eligibleStates?: string[];
    eligibleOccupations?: string[];
    eligibleCategories?: string[];
    requiresDisability?: boolean;
    requiredSpecialStatus?: string[];
}
export interface IWeightedScoreResult {
    score: number;
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
    isEligible: boolean;
    matchedRules: string[];
    unmatchedRules: string[];
}
