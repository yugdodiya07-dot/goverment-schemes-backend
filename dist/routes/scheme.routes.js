"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheme_controller_js_1 = require("../controllers/scheme.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const validate_middleware_js_1 = require("../middleware/validate.middleware.js");
const scheme_validation_js_1 = require("../validations/scheme.validation.js");
const router = (0, express_1.Router)();
router.get('/', scheme_controller_js_1.SchemeController.getSchemes);
router.get('/:slug', scheme_controller_js_1.SchemeController.getSchemeBySlug);
router.post('/', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)('admin', 'officer'), (0, validate_middleware_js_1.validateRequest)(scheme_validation_js_1.schemeCreateSchema), scheme_controller_js_1.SchemeController.createScheme);
router.put('/:id', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)('admin', 'officer'), scheme_controller_js_1.SchemeController.updateScheme);
router.delete('/:id', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)('admin'), scheme_controller_js_1.SchemeController.deleteScheme);
exports.default = router;
//# sourceMappingURL=scheme.routes.js.map