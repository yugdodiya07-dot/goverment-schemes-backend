import { Router } from 'express';
import authRoutes from './auth.routes.js';
import schemeRoutes from './scheme.routes.js';
import eligibilityRoutes from './eligibility.routes.js';
import applicationRoutes from './application.routes.js';
import categoryRoutes from './category.routes.js';
import userRoutes from './user.routes.js';
import statsRoutes from './stats.routes.js';
import savedSchemeRoutes from './savedScheme.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/schemes', schemeRoutes);
apiRouter.use('/eligibility', eligibilityRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/stats', statsRoutes);
apiRouter.use('/saved-schemes', savedSchemeRoutes);

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GovSmart Portal API (v2.0)',
  });
});

export default apiRouter;
