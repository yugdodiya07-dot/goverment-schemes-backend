export declare class StatsService {
    static getAdminOverview(): Promise<{
        totalSchemes: number;
        totalCitizens: number;
        totalApplications: number;
        pendingApplications: number;
        approvedApplications: number;
        rejectedApplications: number;
        approvalRate: number;
        categories: (import("mongoose").Document<unknown, {}, import("../models/Category.js").ICategory, {}, {}> & import("../models/Category.js").ICategory & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    static getCitizenStats(userId: string): Promise<{
        appliedCount: number;
        savedCount: number;
        recentApplications: (import("mongoose").Document<unknown, {}, import("../models/Application.js").IApplication, {}, {}> & import("../models/Application.js").IApplication & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
