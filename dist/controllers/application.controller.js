"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const application_service_js_1 = require("../services/application.service.js");
class ApplicationController {
    static async submit(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { schemeId, formData, documents, eligibilityScore } = req.body;
            const application = await application_service_js_1.ApplicationService.submitApplication(req.user._id.toString(), schemeId, formData, documents, eligibilityScore);
            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                data: application,
            });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    static async getMyApplications(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const applications = await application_service_js_1.ApplicationService.getCitizenApplications(req.user._id.toString());
            res.status(200).json({
                success: true,
                data: applications,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllApplications(req, res, next) {
        try {
            const result = await application_service_js_1.ApplicationService.getAllApplications(req.query);
            res.status(200).json({
                success: true,
                data: result.applications,
                pagination: result.pagination,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { id } = req.params;
            const { status, comment } = req.body;
            const application = await application_service_js_1.ApplicationService.updateApplicationStatus(id, status, comment, req.user._id.toString());
            res.status(200).json({
                success: true,
                message: 'Application status updated successfully',
                data: application,
            });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=application.controller.js.map