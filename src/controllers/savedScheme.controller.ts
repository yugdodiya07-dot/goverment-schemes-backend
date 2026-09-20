import { Response, NextFunction } from 'express';
import { SavedSchemeService } from '../services/savedScheme.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class SavedSchemeController {
  /**
   * Get all saved schemes of the authenticated citizen
   */
  public static async getMySavedSchemes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const savedSchemes = await SavedSchemeService.getUserSavedSchemes(req.user._id.toString());
      res.status(200).json({
        success: true,
        count: savedSchemes.length,
        data: savedSchemes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get list of saved scheme IDs for rapid frontend active bookmark state checking
   */
  public static async getMySavedSchemeIds(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(200).json({ success: true, data: [] });
      }

      const ids = await SavedSchemeService.getUserSavedSchemeIds(req.user._id.toString());
      res.status(200).json({
        success: true,
        data: ids,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle save/unsave for a scheme
   */
  public static async toggle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const { schemeId, notes } = req.body;
      if (!schemeId) {
        return res.status(400).json({ success: false, message: 'schemeId is required' });
      }

      const result = await SavedSchemeService.toggleSaveScheme(req.user._id.toString(), schemeId, notes);
      res.status(200).json({
        success: true,
        message: result.message,
        isSaved: result.isSaved,
        data: result.savedScheme,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Check if specific scheme is saved
   */
  public static async checkStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(200).json({ success: true, isSaved: false });
      }

      const { schemeId } = req.params;
      const isSaved = await SavedSchemeService.isSchemeSaved(req.user._id.toString(), schemeId);
      res.status(200).json({
        success: true,
        isSaved,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unsave a scheme
   */
  public static async unsave(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const { schemeId } = req.params;
      const success = await SavedSchemeService.unsaveScheme(req.user._id.toString(), schemeId);
      res.status(200).json({
        success,
        message: success ? 'Scheme removed from saved watchlist' : 'Scheme was not saved',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update personal notes for a saved scheme
   */
  public static async updateNotes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const { schemeId } = req.params;
      const { notes } = req.body;
      const updated = await SavedSchemeService.updateNotes(req.user._id.toString(), schemeId, notes);
      res.status(200).json({
        success: true,
        message: 'Notes updated',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
