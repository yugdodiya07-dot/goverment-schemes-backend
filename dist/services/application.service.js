"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const Application_js_1 = require("../models/Application.js");
const Scheme_js_1 = require("../models/Scheme.js");
const Notification_js_1 = require("../models/Notification.js");
class ApplicationService {
    static generateAppNumber() {
        const random = Math.floor(100000 + Math.random() * 900000);
        return `GS-${new Date().getFullYear()}-${random}`;
    }
    static async submitApplication(userId, schemeId, formData, documents, eligibilityScore = 100) {
        const appNumber = this.generateAppNumber();
        const application = await Application_js_1.Application.create({
            applicationNumber: appNumber,
            user: userId,
            scheme: schemeId,
            formData,
            documents,
            eligibilityScore,
            status: 'Submitted',
            statusHistory: [
                {
                    status: 'Submitted',
                    comment: 'Application submitted successfully by citizen.',
                    updatedAt: new Date(),
                },
            ],
        });
        await Scheme_js_1.Scheme.findByIdAndUpdate(schemeId, { $inc: { applicationsCount: 1 } });
        // Notify citizen
        await Notification_js_1.Notification.create({
            recipient: userId,
            recipientType: 'User',
            title: 'Application Submitted Successfully',
            message: `Your application #${appNumber} has been received and is queued for verification.`,
            type: 'success',
            link: `/applications/${application._id}`,
        });
        return application;
    }
    static async getCitizenApplications(userId) {
        return await Application_js_1.Application.find({ user: userId })
            .populate('scheme')
            .sort({ createdAt: -1 });
    }
    static async getAllApplications(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(filters.limit) || 15));
        const skip = (page - 1) * limit;
        const query = {};
        if (filters.status && filters.status !== 'All') {
            query.status = filters.status;
        }
        if (filters.schemeId) {
            query.scheme = filters.schemeId;
        }
        if (filters.search) {
            query.applicationNumber = { $regex: filters.search.trim(), $options: 'i' };
        }
        const [applications, total] = await Promise.all([
            Application_js_1.Application.find(query)
                .populate('user', 'name email phone state category')
                .populate('scheme', 'title category ministry benefitType')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Application_js_1.Application.countDocuments(query),
        ]);
        return {
            applications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async updateApplicationStatus(appId, newStatus, comment, adminId) {
        const application = await Application_js_1.Application.findById(appId);
        if (!application) {
            throw new Error('Application not found');
        }
        application.status = newStatus;
        application.adminRemarks = comment;
        if (newStatus === 'Approved' || newStatus === 'Rejected') {
            application.processedAt = new Date();
        }
        application.statusHistory.push({
            status: newStatus,
            comment: comment || `Status updated to ${newStatus}`,
            updatedBy: adminId,
            updatedAt: new Date(),
        });
        await application.save();
        // Notify citizen about status change
        await Notification_js_1.Notification.create({
            recipient: application.user,
            recipientType: 'User',
            title: `Application Update: ${newStatus}`,
            message: `Your application #${application.applicationNumber} status changed to ${newStatus}. Note: ${comment || 'No remarks provided.'}`,
            type: newStatus === 'Approved' ? 'success' : newStatus === 'Rejected' ? 'alert' : 'info',
            link: `/applications/${application._id}`,
        });
        return application;
    }
}
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=application.service.js.map