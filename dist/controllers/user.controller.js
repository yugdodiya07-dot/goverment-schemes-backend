"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_js_1 = require("../models/User.js");
class UserController {
    static async updateProfile(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const allowedFields = [
                'name',
                'phone',
                'age',
                'gender',
                'state',
                'district',
                'address',
                'pincode',
                'annualIncome',
                'occupation',
                'category',
                'disabilityStatus',
                'specialStatus',
            ];
            const updates = {};
            for (const field of allowedFields) {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            }
            const updatedUser = await User_js_1.User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async listUsers(req, res, next) {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
            const skip = (page - 1) * limit;
            const query = {};
            if (req.query.status) {
                query.status = req.query.status;
            }
            if (req.query.search) {
                query.$or = [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } },
                    { phone: { $regex: req.query.search, $options: 'i' } },
                ];
            }
            const [users, total] = await Promise.all([
                User_js_1.User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
                User_js_1.User.countDocuments(query),
            ]);
            res.status(200).json({
                success: true,
                data: users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateUserStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!['Active', 'Blocked'].includes(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status' });
            }
            const user = await User_js_1.User.findByIdAndUpdate(id, { status }, { new: true });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            res.status(200).json({
                success: true,
                message: `User status changed to ${status}`,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map