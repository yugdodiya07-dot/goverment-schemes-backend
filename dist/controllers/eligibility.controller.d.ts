import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
export declare class EligibilityController {
    static checkEligibility(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
