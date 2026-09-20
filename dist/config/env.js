"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/govsmart_portal',
    JWT_SECRET: process.env.JWT_SECRET || 'govsmart_super_secret_jwt_key_2026_india',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
};
//# sourceMappingURL=env.js.map