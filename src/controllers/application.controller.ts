import { Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class ApplicationController {
  public static async submit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { schemeId, formData, documents, eligibilityScore } = req.body;
      const application = await ApplicationService.submitApplication(
        req.user._id.toString(),
        schemeId,
        formData,
        documents,
        eligibilityScore
      );

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: application,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async getMyApplications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const applications = await ApplicationService.getCitizenApplications(req.user._id.toString());
      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllApplications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ApplicationService.getAllApplications(req.query);
      res.status(200).json({
        success: true,
        data: result.applications,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const { id } = req.params;
      const { status, comment } = req.body;

      const application = await ApplicationService.updateApplicationStatus(
        id,
        status,
        comment,
        req.user._id.toString()
      );

      res.status(200).json({
        success: true,
        message: 'Application status updated successfully',
        data: application,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
