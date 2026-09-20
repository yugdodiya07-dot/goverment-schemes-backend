import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
export declare class StatsController {
    static getAdminStats(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    static getCitizenStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
