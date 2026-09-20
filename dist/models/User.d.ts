import mongoose, { Document } from 'mongoose';
import { UserRole, UserStatus } from '../types/index.js';
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    age?: number;
    gender?: 'Male' | 'Female' | 'Transgender' | 'Other';
    state?: string;
    district?: string;
    address?: string;
    pincode?: string;
    annualIncome?: number;
    occupation?: string;
    category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';
    disabilityStatus?: boolean;
    specialStatus?: string[];
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
