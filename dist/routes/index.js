"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_js_1 = __importDefault(require("./auth.routes.js"));
const scheme_routes_js_1 = __importDefault(require("./scheme.routes.js"));
const eligibility_routes_js_1 = __importDefault(require("./eligibility.routes.js"));
const application_routes_js_1 = __importDefault(require("./application.routes.js"));
const category_routes_js_1 = __importDefault(require("./category.routes.js"));
const user_routes_js_1 = __importDefault(require("./user.routes.js"));
const stats_routes_js_1 = __importDefault(require("./stats.routes.js"));
const apiRouter = (0, express_1.Router)();
apiRouter.use('/auth', auth_routes_js_1.default);
apiRouter.use('/schemes', scheme_routes_js_1.default);
apiRouter.use('/eligibility', eligibility_routes_js_1.default);
apiRouter.use('/applications', application_routes_js_1.default);
apiRouter.use('/categories', category_routes_js_1.default);
apiRouter.use('/users', user_routes_js_1.default);
apiRouter.use('/stats', stats_routes_js_1.default);
// Health check endpoint
apiRouter.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'GovSmart Portal API (v2.0)',
    });
});
exports.default = apiRouter;
//# sourceMappingURL=index.js.map