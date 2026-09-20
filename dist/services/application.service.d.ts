import { IApplication } from '../models/Application.js';
import { ApplicationStatus } from '../types/index.js';
export declare class ApplicationService {
    private static generateAppNumber;
    static submitApplication(userId: string, schemeId: string, formData: Record<string, any>, documents: Array<{
        documentName: string;
        documentType: string;
        fileUrl: string;
    }>, eligibilityScore?: number): Promise<IApplication>;
    static getCitizenApplications(userId: string): Promise<(import("mongoose").Document<unknown, {}, IApplication, {}, {}> & IApplication & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    static getAllApplications(filters: {
        status?: string;
        schemeId?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        applications: (import("mongoose").Document<unknown, {}, IApplication, {}, {}> & IApplication & Required<{
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
    static updateApplicationStatus(appId: string, newStatus: ApplicationStatus, comment: string, adminId: string): Promise<IApplication | null>;
}
