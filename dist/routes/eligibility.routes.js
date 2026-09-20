"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eligibility_controller_js_1 = require("../controllers/eligibility.controller.js");
const validate_middleware_js_1 = require("../middleware/validate.middleware.js");
const eligibility_validation_js_1 = require("../validations/eligibility.validation.js");
const router = (0, express_1.Router)();
// Allow both guest citizens and logged in citizens to calculate eligibility
router.post('/check', (0, validate_middleware_js_1.validateRequest)(eligibility_validation_js_1.eligibilityCheckSchema), eligibility_controller_js_1.EligibilityController.checkEligibility);
exports.default = router;
//# sourceMappingURL=eligibility.routes.js.map