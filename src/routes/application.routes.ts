import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { submitApplicationSchema, updateApplicationStatusSchema } from '../validations/application.validation.js';

const router = Router();

// Citizen routes
router.post('/submit', authenticate, validateRequest(submitApplicationSchema), ApplicationController.submit);
router.get('/my', authenticate, ApplicationController.getMyApplications);

// Admin routes
router.get('/all', authenticate, authorize('admin', 'officer'), ApplicationController.getAllApplications);
router.patch('/:id/status', authenticate, authorize('admin', 'officer'), validateRequest(updateApplicationStatusSchema), ApplicationController.updateStatus);

export default router;
