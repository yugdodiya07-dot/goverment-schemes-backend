import { Router } from 'express';
import { EligibilityController } from '../controllers/eligibility.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { eligibilityCheckSchema } from '../validations/eligibility.validation.js';

const router = Router();

// Allow both guest citizens and logged in citizens to calculate eligibility
router.post('/check', validateRequest(eligibilityCheckSchema), EligibilityController.checkEligibility);

export default router;
