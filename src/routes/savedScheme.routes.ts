import { Router } from 'express';
import { SavedSchemeController } from '../controllers/savedScheme.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All saved scheme routes require authentication
router.use(authenticate);

router.get('/', SavedSchemeController.getMySavedSchemes);
router.get('/ids', SavedSchemeController.getMySavedSchemeIds);
router.post('/toggle', SavedSchemeController.toggle);
router.get('/check/:schemeId', SavedSchemeController.checkStatus);
router.delete('/:schemeId', SavedSchemeController.unsave);
router.patch('/:schemeId/notes', SavedSchemeController.updateNotes);

export default router;
