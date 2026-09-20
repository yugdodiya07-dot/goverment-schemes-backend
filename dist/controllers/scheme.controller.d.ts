import { Request, Response, NextFunction } from 'express';
export declare class SchemeController {
    static getSchemes(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSchemeBySlug(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static createScheme(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateScheme(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteScheme(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
