import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
export declare class SavedSchemeController {
    /**
     * Get all saved schemes of the authenticated citizen
     */
    static getMySavedSchemes(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Get list of saved scheme IDs for rapid frontend active bookmark state checking
     */
    static getMySavedSchemeIds(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Toggle save/unsave for a scheme
     */
    static toggle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Check if specific scheme is saved
     */
    static checkStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Unsave a scheme
     */
    static unsave(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Update personal notes for a saved scheme
     */
    static updateNotes(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
