"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const savedScheme_controller_js_1 = require("../controllers/savedScheme.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
// All saved scheme routes require authentication
router.use(auth_middleware_js_1.authenticate);
router.get('/', savedScheme_controller_js_1.SavedSchemeController.getMySavedSchemes);
router.get('/ids', savedScheme_controller_js_1.SavedSchemeController.getMySavedSchemeIds);
router.post('/toggle', savedScheme_controller_js_1.SavedSchemeController.toggle);
router.get('/check/:schemeId', savedScheme_controller_js_1.SavedSchemeController.checkStatus);
router.delete('/:schemeId', savedScheme_controller_js_1.SavedSchemeController.unsave);
router.patch('/:schemeId/notes', savedScheme_controller_js_1.SavedSchemeController.updateNotes);
exports.default = router;
//# sourceMappingURL=savedScheme.routes.js.map