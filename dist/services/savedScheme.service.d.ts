import { ISavedScheme } from '../models/SavedScheme.js';
import { Types } from 'mongoose';
export declare class SavedSchemeService {
    /**
     * Fetch all saved schemes for a given user with populated scheme and category details
     */
    static getUserSavedSchemes(userId: string | Types.ObjectId): Promise<ISavedScheme[]>;
    /**
     * Get array of scheme ID strings saved by user for fast client-side lookup
     */
    static getUserSavedSchemeIds(userId: string | Types.ObjectId): Promise<string[]>;
    /**
     * Check if a specific scheme is saved by the user
     */
    static isSchemeSaved(userId: string | Types.ObjectId, schemeId: string | Types.ObjectId): Promise<boolean>;
    /**
     * Toggle save state (save if not saved, remove if already saved)
     */
    static toggleSaveScheme(userId: string | Types.ObjectId, schemeId: string | Types.ObjectId, notes?: string): Promise<{
        isSaved: boolean;
        message: string;
        savedScheme?: ISavedScheme;
    }>;
    /**
     * Explicitly remove a saved scheme
     */
    static unsaveScheme(userId: string | Types.ObjectId, schemeId: string | Types.ObjectId): Promise<boolean>;
    /**
     * Update personal notes on a saved scheme
     */
    static updateNotes(userId: string | Types.ObjectId, schemeId: string | Types.ObjectId, notes: string): Promise<ISavedScheme | null>;
}
