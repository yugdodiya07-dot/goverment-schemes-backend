import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
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

const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true, default: 'Government Portal Administrator' },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, default: '9876543210' },
    role: { type: String, enum: ['admin', 'officer'], default: 'admin', immutable: true },
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
    department: { type: String, default: 'National Informatics Centre' },
    designation: { type: String, default: 'Portal Super Administrator' },
  },
  { timestamps: true, collection: 'admins' }
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
