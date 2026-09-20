import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISavedScheme extends Document {
  user: Types.ObjectId | string;
  scheme: Types.ObjectId | string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const savedSchemeSchema = new Schema<ISavedScheme>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    scheme: { type: Schema.Types.ObjectId, ref: 'Scheme', required: true, index: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true, collection: 'savedschemes' }
);

savedSchemeSchema.index({ user: 1, scheme: 1 }, { unique: true });

export const SavedScheme = mongoose.model<ISavedScheme>('SavedScheme', savedSchemeSchema);
