"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const Scheme_js_1 = require("../models/Scheme.js");
const Application_js_1 = require("../models/Application.js");
const User_js_1 = require("../models/User.js");
const Category_js_1 = require("../models/Category.js");
const SavedScheme_js_1 = require("../models/SavedScheme.js");
class StatsService {
    static async getAdminOverview() {
        const [totalSchemes, totalCitizens, totalApplications, pendingApplications, approvedApplications, rejectedApplications, categories,] = await Promise.all([
            Scheme_js_1.Scheme.countDocuments({ status: 'Active' }),
            User_js_1.User.countDocuments({ status: 'Active' }),
            Application_js_1.Application.countDocuments(),
            Application_js_1.Application.countDocuments({ status: { $in: ['Submitted', 'Under Review', 'Document Verification'] } }),
            Application_js_1.Application.countDocuments({ status: 'Approved' }),
            Application_js_1.Application.countDocuments({ status: 'Rejected' }),
            Category_js_1.Category.find().select('name slug schemeCount'),
        ]);
        const approvalRate = totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0;
        return {
            totalSchemes,
            totalCitizens,
            totalApplications,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
            approvalRate,
            categories,
        };
    }
    static async getCitizenStats(userId) {
        const [appliedCount, savedCount, recentApplications] = await Promise.all([
            Application_js_1.Application.countDocuments({ user: userId }),
            SavedScheme_js_1.SavedScheme.countDocuments({ user: userId }),
            Application_js_1.Application.find({ user: userId }).populate('scheme', 'title category ministry').sort({ createdAt: -1 }).limit(5),
        ]);
        return {
            appliedCount,
            savedCount,
            recentApplications,
        };
    }
}
exports.StatsService = StatsService;
//# sourceMappingURL=stats.service.js.map