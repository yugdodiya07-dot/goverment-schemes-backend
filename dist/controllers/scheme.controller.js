"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemeController = void 0;
const scheme_service_js_1 = require("../services/scheme.service.js");
class SchemeController {
    static async getSchemes(req, res, next) {
        try {
            const result = await scheme_service_js_1.SchemeService.querySchemes(req.query);
            res.status(200).json({
                success: true,
                data: result.schemes,
                pagination: result.pagination,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getSchemeBySlug(req, res, next) {
        try {
            const scheme = await scheme_service_js_1.SchemeService.getSchemeBySlug(req.params.slug);
            if (!scheme) {
                return res.status(404).json({ success: false, message: 'Scheme not found' });
            }
            res.status(200).json({
                success: true,
                data: scheme,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createScheme(req, res, next) {
        try {
            const scheme = await scheme_service_js_1.SchemeService.createScheme(req.body);
            res.status(201).json({
                success: true,
                message: 'Scheme created successfully',
                data: scheme,
            });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    static async updateScheme(req, res, next) {
        try {
            const scheme = await scheme_service_js_1.SchemeService.updateScheme(req.params.id, req.body);
            if (!scheme) {
                return res.status(404).json({ success: false, message: 'Scheme not found' });
            }
            res.status(200).json({
                success: true,
                message: 'Scheme updated successfully',
                data: scheme,
            });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    static async deleteScheme(req, res, next) {
        try {
            const success = await scheme_service_js_1.SchemeService.deleteScheme(req.params.id);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Scheme not found' });
            }
            res.status(200).json({
                success: true,
                message: 'Scheme deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SchemeController = SchemeController;
//# sourceMappingURL=scheme.controller.js.map