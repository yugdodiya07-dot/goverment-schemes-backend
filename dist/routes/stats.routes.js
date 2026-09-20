"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_js_1 = require("../controllers/stats.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
router.get('/admin', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)('admin', 'officer'), stats_controller_js_1.StatsController.getAdminStats);
router.get('/citizen', auth_middleware_js_1.authenticate, stats_controller_js_1.StatsController.getCitizenStats);
exports.default = router;
//# sourceMappingURL=stats.routes.js.map