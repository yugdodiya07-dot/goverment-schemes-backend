import { Request, Response, NextFunction } from 'express';
export declare class CategoryController {
    static getCategories(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
