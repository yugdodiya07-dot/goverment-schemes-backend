import mongoose, { Document, Types } from 'mongoose';
export interface INotification extends Document {
    recipient: Types.ObjectId | string;
    recipientType: 'User' | 'Admin';
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'alert';
    link?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
