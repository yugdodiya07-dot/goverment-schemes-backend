"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = require("../models/User.js");
const Admin_js_1 = require("../models/Admin.js");
const env_js_1 = require("../config/env.js");
class AuthService {
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
        }, env_js_1.env.JWT_SECRET, { expiresIn: env_js_1.env.JWT_EXPIRES_IN });
    }
    static async registerCitizen(data) {
        const existing = await User_js_1.User.findOne({ email: data.email?.toLowerCase() });
        if (existing) {
            throw new Error('An account with this email address already exists.');
        }
        const newUser = await User_js_1.User.create({
            ...data,
            email: data.email?.toLowerCase(),
            role: 'citizen',
            status: 'Active',
        });
        const payload = {
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
    static async login(email, password) {
        const cleanEmail = email.toLowerCase().trim();
        // Check citizen user
        let citizen = await User_js_1.User.findOne({ email: cleanEmail }).select('+password');
        if (citizen) {
            if (citizen.status === 'Blocked') {
                throw new Error('Your citizen account is currently blocked by administration.');
            }
            const isMatch = await citizen.matchPassword(password);
            if (!isMatch) {
                throw new Error('Invalid email address or password.');
            }
            const payload = {
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
        let admin = await Admin_js_1.Admin.findOne({ email: cleanEmail }).select('+password');
        if (admin) {
            if (admin.status === 'Blocked') {
                throw new Error('Administrative account is currently locked.');
            }
            const isMatch = await admin.matchPassword(password);
            if (!isMatch) {
                throw new Error('Invalid email address or password.');
            }
            const payload = {
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
    static async getCurrentUser(userId, role) {
        if (role === 'admin' || role === 'officer') {
            return await Admin_js_1.Admin.findById(userId);
        }
        return await User_js_1.User.findById(userId);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map