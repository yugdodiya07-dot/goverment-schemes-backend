import { Router } from 'express';
import { SchemeController } from '../controllers/scheme.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { schemeCreateSchema } from '../validations/scheme.validation.js';

const router = Router();

router.get('/', SchemeController.getSchemes);
router.get('/states-summary', SchemeController.getStatesSummary);
router.get('/:slug', SchemeController.getSchemeBySlug);
router.post('/', authenticate, authorize('admin', 'officer'), validateRequest(schemeCreateSchema), SchemeController.createScheme);
router.put('/:id', authenticate, authorize('admin', 'officer'), SchemeController.updateScheme);
router.delete('/:id', authenticate, authorize('admin'), SchemeController.deleteScheme);

export default router;
