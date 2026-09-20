import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon: string;
  description: string;
  bannerImage?: string;
  isActive: boolean;
  schemeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    icon: { type: String, default: 'Building2' },
    description: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    schemeCount: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'categories' }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
