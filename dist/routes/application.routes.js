"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_js_1 = require("../controllers/application.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const validate_middleware_js_1 = require("../middleware/validate.middleware.js");
const application_validation_js_1 = require("../validations/application.validation.js");
const router = (0, express_1.Router)();
// Citizen routes
router.post('/submit', auth_middleware_js_1.authenticate, (0, validate_middleware_js_1.validateRequest)(application_validation_js_1.submitApplicationSchema), application_controller_js_1.ApplicationController.submit);
router.get('/my', auth_middleware_js_1.authenticate, application_controller_js_1.ApplicationController.getMyApplications);
// Admin routes
router.get('/all', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)('admin', 'officer'), application_controller_js_1.ApplicationController.getAllApplications);
router.patch('/:id/status', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)('admin', 'officer'), (0, validate_middleware_js_1.validateRequest)(application_validation_js_1.updateApplicationStatusSchema), application_controller_js_1.ApplicationController.updateStatus);
exports.default = router;
//# sourceMappingURL=application.routes.js.map