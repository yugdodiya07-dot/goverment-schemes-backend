"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_js_1 = require("../controllers/category.controller.js");
const router = (0, express_1.Router)();
router.get('/', category_controller_js_1.CategoryController.getCategories);
router.get('/:slug', category_controller_js_1.CategoryController.getCategoryBySlug);
exports.default = router;
//# sourceMappingURL=category.routes.js.map