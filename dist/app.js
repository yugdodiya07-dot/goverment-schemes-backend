"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const error_middleware_js_1 = require("./middleware/error.middleware.js");
const env_js_1 = require("./config/env.js");
const createApp = () => {
    const app = (0, express_1.default)();
    // Security & standard HTTP headers
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
    // CORS configuration
    app.use((0, cors_1.default)({
        origin: [env_js_1.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    // Request logging
    app.use((0, morgan_1.default)(env_js_1.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
    // Body parsers
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // Static uploads directory
    app.use('/uploads', express_1.default.static(path_1.default.resolve(process.cwd(), env_js_1.env.UPLOAD_PATH)));
    // Mount API endpoints
    app.use('/api', index_js_1.default);
    // 404 Handler
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            message: 'The requested API resource was not found.',
        });
    });
    // Centralized Error Handler
    app.use(error_middleware_js_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map