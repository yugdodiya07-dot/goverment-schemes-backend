import { Request, Response, NextFunction } from 'express';
import { SchemeService } from '../services/scheme.service.js';

export class SchemeController {
  public static async getSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SchemeService.querySchemes(req.query);
      res.status(200).json({
        success: true,
        data: result.schemes,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getSchemeBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await SchemeService.getSchemeBySlug(req.params.slug);
      if (!scheme) {
        return res.status(404).json({ success: false, message: 'Scheme not found' });
      }
      res.status(200).json({
        success: true,
        data: scheme,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await SchemeService.createScheme(req.body);
      res.status(201).json({
        success: true,
        message: 'Scheme created successfully',
        data: scheme,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async updateScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await SchemeService.updateScheme(req.params.id, req.body);
      if (!scheme) {
        return res.status(404).json({ success: false, message: 'Scheme not found' });
      }
      res.status(200).json({
        success: true,
        message: 'Scheme updated successfully',
        data: scheme,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async deleteScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await SchemeService.deleteScheme(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Scheme not found' });
      }
      res.status(200).json({
        success: true,
        message: 'Scheme deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
