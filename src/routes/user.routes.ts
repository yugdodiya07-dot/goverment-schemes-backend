import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.put('/profile', authenticate, UserController.updateProfile);
router.get('/all', authenticate, authorize('admin', 'officer'), UserController.listUsers);
router.patch('/:id/status', authenticate, authorize('admin'), UserController.updateUserStatus);

export default router;
