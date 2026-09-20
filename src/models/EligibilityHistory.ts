import mongoose, { Document, Schema, Types } from 'mongoose';

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

const eligibilityHistorySchema = new Schema<IEligibilityHistory>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    searchCriteria: { type: Schema.Types.Mixed, required: true },
    eligibleSchemesCount: { type: Number, default: 0 },
    topMatchedSchemes: [
      {
        schemeId: { type: Schema.Types.ObjectId, ref: 'Scheme' },
        title: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true, collection: 'eligibilityhistories' }
);

export const EligibilityHistory = mongoose.model<IEligibilityHistory>('EligibilityHistory', eligibilityHistorySchema);
