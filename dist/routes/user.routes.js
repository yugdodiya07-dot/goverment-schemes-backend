"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_js_1 = require("../controllers/user.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
router.put('/profile', auth_middleware_js_1.authenticate, user_controller_js_1.UserController.updateProfile);
router.get('/all', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)('admin', 'officer'), user_controller_js_1.UserController.listUsers);
router.patch('/:id/status', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)('admin'), user_controller_js_1.UserController.updateUserStatus);
exports.default = router;
//# sourceMappingURL=user.routes.js.map