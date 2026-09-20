"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedSchemeService = void 0;
const SavedScheme_js_1 = require("../models/SavedScheme.js");
const Scheme_js_1 = require("../models/Scheme.js");
class SavedSchemeService {
    /**
     * Fetch all saved schemes for a given user with populated scheme and category details
     */
    static async getUserSavedSchemes(userId) {
        const list = await SavedScheme_js_1.SavedScheme.find({ user: userId })
            .populate({
            path: 'scheme',
            populate: {
                path: 'category',
                select: 'name slug icon',
            },
        })
            .sort({ createdAt: -1 })
            .lean();
        // Filter out null schemes if a scheme was deleted
        return list.filter((item) => item.scheme != null);
    }
    /**
     * Get array of scheme ID strings saved by user for fast client-side lookup
     */
    static async getUserSavedSchemeIds(userId) {
        const list = await SavedScheme_js_1.SavedScheme.find({ user: userId }).select('scheme').lean();
        return list.map((item) => item.scheme.toString());
    }
    /**
     * Check if a specific scheme is saved by the user
     */
    static async isSchemeSaved(userId, schemeId) {
        const count = await SavedScheme_js_1.SavedScheme.countDocuments({ user: userId, scheme: schemeId });
        return count > 0;
    }
    /**
     * Toggle save state (save if not saved, remove if already saved)
     */
    static async toggleSaveScheme(userId, schemeId, notes) {
        const existing = await SavedScheme_js_1.SavedScheme.findOne({ user: userId, scheme: schemeId });
        if (existing) {
            await SavedScheme_js_1.SavedScheme.findByIdAndDelete(existing._id);
            return {
                isSaved: false,
                message: 'Scheme removed from your saved watchlist.',
            };
        }
        // Verify scheme exists
        const schemeExists = await Scheme_js_1.Scheme.findById(schemeId);
        if (!schemeExists) {
            throw new Error('Scheme not found.');
        }
        const saved = await SavedScheme_js_1.SavedScheme.create({
            user: userId,
            scheme: schemeId,
            notes: notes || '',
        });
        const populated = await SavedScheme_js_1.SavedScheme.findById(saved._id).populate({
            path: 'scheme',
            populate: { path: 'category', select: 'name slug icon' },
        });
        return {
            isSaved: true,
            message: 'Scheme successfully added to your saved watchlist.',
            savedScheme: populated || saved,
        };
    }
    /**
     * Explicitly remove a saved scheme
     */
    static async unsaveScheme(userId, schemeId) {
        const result = await SavedScheme_js_1.SavedScheme.findOneAndDelete({ user: userId, scheme: schemeId });
        return !!result;
    }
    /**
     * Update personal notes on a saved scheme
     */
    static async updateNotes(userId, schemeId, notes) {
        const updated = await SavedScheme_js_1.SavedScheme.findOneAndUpdate({ user: userId, scheme: schemeId }, { notes }, { new: true });
        return updated;
    }
}
exports.SavedSchemeService = SavedSchemeService;
//# sourceMappingURL=savedScheme.service.js.map