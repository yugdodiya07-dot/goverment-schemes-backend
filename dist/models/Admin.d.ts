import mongoose, { Document } from 'mongoose';
import { UserRole, UserStatus } from '../types/index.js';
export interface IAdmin extends Document {
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    department: string;
    designation: string;
    createdAt: Date;
    updatedAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}
export declare const Admin: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin, {}, {}> & IAdmin & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
