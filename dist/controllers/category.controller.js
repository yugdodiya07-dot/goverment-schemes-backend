"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const Category_js_1 = require("../models/Category.js");
class CategoryController {
    static async getCategories(_req, res, next) {
        try {
            const categories = await Category_js_1.Category.find({ isActive: true }).sort({ name: 1 });
            res.status(200).json({
                success: true,
                data: categories,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCategoryBySlug(req, res, next) {
        try {
            const category = await Category_js_1.Category.findOne({ slug: req.params.slug });
            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            res.status(200).json({
                success: true,
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map