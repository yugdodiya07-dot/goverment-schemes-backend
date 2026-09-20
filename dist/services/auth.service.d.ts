import { IUser } from '../models/User.js';
import { IAdmin } from '../models/Admin.js';
import { IUserPayload } from '../types/index.js';
export declare class AuthService {
    static generateToken(user: IUserPayload): string;
    static registerCitizen(data: Partial<IUser>): Promise<{
        user: IUserPayload;
        token: string;
    }>;
    static login(email: string, password: string): Promise<{
        user: IUserPayload;
        token: string;
    }>;
    static getCurrentUser(userId: string, role: string): Promise<(import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | (import("mongoose").Document<unknown, {}, IAdmin, {}, {}> & IAdmin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
