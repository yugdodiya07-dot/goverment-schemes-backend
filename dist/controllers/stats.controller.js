"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const stats_service_js_1 = require("../services/stats.service.js");
class StatsController {
    static async getAdminStats(_req, res, next) {
        try {
            const stats = await stats_service_js_1.StatsService.getAdminOverview();
            res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCitizenStats(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const stats = await stats_service_js_1.StatsService.getCitizenStats(req.user._id.toString());
            res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StatsController = StatsController;
//# sourceMappingURL=stats.controller.js.map