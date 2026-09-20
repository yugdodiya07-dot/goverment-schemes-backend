import mongoose, { Document, Types } from 'mongoose';
import { IEligibilityCriteria } from '../types/index.js';
export interface IScheme extends Document {
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    category: Types.ObjectId | string;
    ministry: string;
    department?: string;
    benefitType: 'Direct Benefit Transfer' | 'Subsidy' | 'Loan / Credit' | 'Insurance' | 'Skill Training' | 'In-Kind Support';
    financialBenefit: string;
    eligibilityCriteria: IEligibilityCriteria;
    requiredDocuments: string[];
    applicationProcess: string[];
    officialUrl?: string;
    helplineNumber?: string;
    tags: string[];
    bannerImage?: string;
    status: 'Active' | 'Draft' | 'Archived';
    viewsCount: number;
    applicationsCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Scheme: mongoose.Model<IScheme, {}, {}, {}, mongoose.Document<unknown, {}, IScheme, {}, {}> & IScheme & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
