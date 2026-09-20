import mongoose, { Document, Types } from 'mongoose';
export interface IEligibilityHistory extends Document {
    user?: Types.ObjectId | string;
    searchCriteria: Record<string, any>;
    eligibleSchemesCount: number;
    topMatchedSchemes: Array<{
        schemeId: Types.ObjectId | string;
        title: string;
        score: number;
    }>;
    ipAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const EligibilityHistory: mongoose.Model<IEligibilityHistory, {}, {}, {}, mongoose.Document<unknown, {}, IEligibilityHistory, {}, {}> & IEligibilityHistory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
