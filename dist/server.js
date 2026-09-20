"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const database_js_1 = require("./config/database.js");
const env_js_1 = require("./config/env.js");
const startServer = async () => {
    try {
        console.log('🚀 Initializing Government Schemes Portal Backend (v2.0)...');
        await (0, database_js_1.connectDatabase)();
        const app = (0, app_js_1.createApp)();
        app.listen(env_js_1.env.PORT, () => {
            console.log(`🌐 Server running in ${env_js_1.env.NODE_ENV} mode on http://localhost:${env_js_1.env.PORT}`);
            console.log(`📡 Health endpoint: http://localhost:${env_js_1.env.PORT}/api/health`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map