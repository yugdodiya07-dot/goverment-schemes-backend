import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { Admin, IAdmin } from '../models/Admin.js';
import { env } from '../config/env.js';
import { IUserPayload } from '../types/index.js';

export class AuthService {
  public static generateToken(user: IUserPayload): string {
    return jwt.sign(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );
  }

  public static async registerCitizen(data: Partial<IUser>): Promise<{ user: IUserPayload; token: string }> {
    const existing = await User.findOne({ email: data.email?.toLowerCase() });
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = await User.create({
      ...data,
      email: data.email?.toLowerCase(),
      role: 'citizen',
      status: 'Active',
    });

    const payload: IUserPayload = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: 'citizen',
      phone: newUser.phone,
      status: newUser.status,
    };

    const token = this.generateToken(payload);
    return { user: payload, token };
  }

  public static async login(email: string, password: string): Promise<{ user: IUserPayload; token: string }> {
    const cleanEmail = email.toLowerCase().trim();

    // Check citizen user
    let citizen = await User.findOne({ email: cleanEmail }).select('+password');
    if (citizen) {
      if (citizen.status === 'Blocked') {
        throw new Error('Your citizen account is currently blocked by administration.');
      }
      const isMatch = await citizen.matchPassword(password);
      if (!isMatch) {
        throw new Error('Invalid email address or password.');
      }
      const payload: IUserPayload = {
        _id: citizen._id,
        name: citizen.name,
        email: citizen.email,
        role: 'citizen',
        phone: citizen.phone,
        status: citizen.status,
      };
      const token = this.generateToken(payload);
      return { user: payload, token };
    }

    // Check admin user
    let admin = await Admin.findOne({ email: cleanEmail }).select('+password');
    if (admin) {
      if (admin.status === 'Blocked') {
        throw new Error('Administrative account is currently locked.');
      }
      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        throw new Error('Invalid email address or password.');
      }
      const payload: IUserPayload = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
        status: admin.status,
        department: admin.department,
      };
      const token = this.generateToken(payload);
      return { user: payload, token };
    }

    throw new Error('No account found with this email address.');
  }

  public static async getCurrentUser(userId: string, role: string) {
    if (role === 'admin' || role === 'officer') {
      return await Admin.findById(userId);
    }
    return await User.findById(userId);
  }
}
