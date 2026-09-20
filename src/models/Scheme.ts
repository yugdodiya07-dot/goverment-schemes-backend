import mongoose, { Document, Schema, Types } from 'mongoose';
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

const schemeSchema = new Schema<IScheme>(
  {
    title: { type: String, required: [true, 'Please provide scheme title'], trim: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    ministry: { type: String, required: true, trim: true },
    department: { type: String, default: '' },
    benefitType: {
      type: String,
      enum: ['Direct Benefit Transfer', 'Subsidy', 'Loan / Credit', 'Insurance', 'Skill Training', 'In-Kind Support'],
      default: 'Direct Benefit Transfer',
    },
    financialBenefit: { type: String, required: true },
    eligibilityCriteria: {
      minAge: { type: Number, default: 0 },
      maxAge: { type: Number, default: 100 },
      gender: { type: String, enum: ['All', 'Male', 'Female', 'Transgender'], default: 'All' },
      maxIncome: { type: Number, default: 100000000 },
      eligibleStates: [{ type: String }],
      eligibleOccupations: [{ type: String }],
      eligibleCategories: [{ type: String }],
      requiresDisability: { type: Boolean, default: false },
      requiredSpecialStatus: [{ type: String }],
    },
    requiredDocuments: [{ type: String }],
    applicationProcess: [{ type: String }],
    officialUrl: { type: String, default: '' },
    helplineNumber: { type: String, default: '1800-111-999' },
    tags: [{ type: String }],
    bannerImage: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Draft', 'Archived'], default: 'Active' },
    viewsCount: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'schemes' }
);

schemeSchema.index({ title: 'text', shortDescription: 'text', ministry: 'text', tags: 'text' });
schemeSchema.index({ category: 1, status: 1 });

export const Scheme = mongoose.model<IScheme>('Scheme', schemeSchema);
