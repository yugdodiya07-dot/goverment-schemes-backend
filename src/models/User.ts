import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
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

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'Please provide full name'], trim: true },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: [true, 'Please provide password'], minlength: 6, select: false },
    phone: { type: String, required: [true, 'Please provide mobile number'], trim: true },
    role: { type: String, enum: ['citizen', 'admin', 'officer'], default: 'citizen' },
    status: { type: String, enum: ['Active', 'Blocked', 'Deleted'], default: 'Active' },
    age: { type: Number, min: 0, max: 120 },
    gender: { type: String, enum: ['Male', 'Female', 'Transgender', 'Other'], default: 'Male' },
    state: { type: String, default: 'National' },
    district: { type: String, default: '' },
    address: { type: String, default: '' },
    pincode: { type: String, default: '' },
    annualIncome: { type: Number, default: 0 },
    occupation: { type: String, default: 'Student' },
    category: { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'], default: 'General' },
    disabilityStatus: { type: Boolean, default: false },
    specialStatus: [{ type: String }],
    avatar: { type: String, default: '' },
  },
  { timestamps: true, collection: 'users' }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
