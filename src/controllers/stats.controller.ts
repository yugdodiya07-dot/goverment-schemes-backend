import { Response, NextFunction } from 'express';
import { StatsService } from '../services/stats.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class StatsController {
  public static async getAdminStats(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await StatsService.getAdminOverview();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCitizenStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const stats = await StatsService.getCitizenStats(req.user._id.toString());
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
