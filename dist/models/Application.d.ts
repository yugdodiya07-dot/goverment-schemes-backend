import mongoose, { Document, Types } from 'mongoose';
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
export declare const Application: mongoose.Model<IApplication, {}, {}, {}, mongoose.Document<unknown, {}, IApplication, {}, {}> & IApplication & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
