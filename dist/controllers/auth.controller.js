"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
class AuthController {
    static async register(req, res, next) {
        try {
            const { user, token } = await auth_service_js_1.AuthService.registerCitizen(req.body);
            res.status(201).json({
                success: true,
                message: 'Registration successful. Welcome to GovSmart Portal!',
                data: { user, token },
            });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, token } = await auth_service_js_1.AuthService.login(email, password);
            res.status(200).json({
                success: true,
                message: 'Login successful.',
                data: { user, token },
            });
        }
        catch (error) {
            res.status(401).json({ success: false, message: error.message });
        }
    }
    static async getProfile(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const user = await auth_service_js_1.AuthService.getCurrentUser(req.user._id.toString(), req.user.role);
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map