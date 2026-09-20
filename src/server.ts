import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    console.log('🚀 Initializing Government Schemes Portal Backend (v2.0)...');
    await connectDatabase();

    const app = createApp();

    app.listen(env.PORT, () => {
      console.log(`🌐 Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
      console.log(`📡 Health endpoint: http://localhost:${env.PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
