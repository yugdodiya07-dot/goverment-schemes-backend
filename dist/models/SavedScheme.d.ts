import mongoose, { Document, Types } from 'mongoose';
export interface ISavedScheme extends Document {
    user: Types.ObjectId | string;
    scheme: Types.ObjectId | string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const SavedScheme: mongoose.Model<ISavedScheme, {}, {}, {}, mongoose.Document<unknown, {}, ISavedScheme, {}, {}> & ISavedScheme & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
