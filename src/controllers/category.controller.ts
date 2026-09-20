import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.js';

export class CategoryController {
  public static async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await Category.find({ isActive: true }).sort({ name: 1 });
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await Category.findOne({ slug: req.params.slug });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
}
