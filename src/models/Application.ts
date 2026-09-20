import mongoose, { Document, Schema, Types } from 'mongoose';
import { ApplicationStatus } from '../types/index.js';

export interface IStatusAudit {
  status: ApplicationStatus;
  comment: string;
  updatedBy: Types.ObjectId | string;
  updatedAt: Date;
}

export interface IUploadedDocument {
  documentName: string;
  documentType: string;
  fileUrl: string;
  uploadedAt: Date;
}

export interface IApplication extends Document {
  applicationNumber: string;
  user: Types.ObjectId | string;
  scheme: Types.ObjectId | string;
  formData: Record<string, any>;
  documents: IUploadedDocument[];
  eligibilityScore: number;
  status: ApplicationStatus;
  statusHistory: IStatusAudit[];
  adminRemarks?: string;
  submittedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    applicationNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    scheme: { type: Schema.Types.ObjectId, ref: 'Scheme', required: true, index: true },
    formData: { type: Schema.Types.Mixed, default: {} },
    documents: [
      {
        documentName: { type: String, required: true },
        documentType: { type: String, default: 'PDF' },
        fileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    eligibilityScore: { type: Number, default: 100 },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Document Verification', 'Approved', 'Rejected'],
      default: 'Submitted',
      index: true,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        comment: { type: String, default: '' },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    adminRemarks: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
  },
  { timestamps: true, collection: 'applications' }
);

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
