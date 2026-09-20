import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/admin', authenticate, authorize('admin', 'officer'), StatsController.getAdminStats);
router.get('/citizen', authenticate, StatsController.getCitizenStats);

export default router;
