import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await AuthService.registerCitizen(req.body);
      res.status(201).json({
        success: true,
        message: 'Registration successful. Welcome to GovSmart Portal!',
        data: { user, token },
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: { user, token },
      });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  public static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const user = await AuthService.getCurrentUser(req.user._id.toString(), req.user.role);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
