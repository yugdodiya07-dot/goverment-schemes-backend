import { IScheme } from '../models/Scheme.js';
export interface ISchemeQueryFilters {
    search?: string;
    category?: string;
    benefitType?: string;
    state?: string;
    gender?: string;
    occupation?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
}
export declare class SchemeService {
    static querySchemes(filters: ISchemeQueryFilters): Promise<{
        schemes: (import("mongoose").Document<unknown, {}, IScheme, {}, {}> & IScheme & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getSchemeBySlug(slug: string): Promise<IScheme | null>;
    static createScheme(data: Partial<IScheme>): Promise<IScheme>;
    static updateScheme(id: string, data: Partial<IScheme>): Promise<IScheme | null>;
    static deleteScheme(id: string): Promise<boolean>;
}
