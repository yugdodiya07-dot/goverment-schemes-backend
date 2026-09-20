"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const validate_middleware_js_1 = require("../middleware/validate.middleware.js");
const auth_validation_js_1 = require("../validations/auth.validation.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_middleware_js_1.validateRequest)(auth_validation_js_1.registerSchema), auth_controller_js_1.AuthController.register);
router.post('/login', (0, validate_middleware_js_1.validateRequest)(auth_validation_js_1.loginSchema), auth_controller_js_1.AuthController.login);
router.get('/me', auth_middleware_js_1.authenticate, auth_controller_js_1.AuthController.getProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map