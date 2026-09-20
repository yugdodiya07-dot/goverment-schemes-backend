"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedSchemeController = void 0;
const savedScheme_service_js_1 = require("../services/savedScheme.service.js");
class SavedSchemeController {
    /**
     * Get all saved schemes of the authenticated citizen
     */
    static async getMySavedSchemes(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }
            const savedSchemes = await savedScheme_service_js_1.SavedSchemeService.getUserSavedSchemes(req.user._id.toString());
            res.status(200).json({
                success: true,
                count: savedSchemes.length,
                data: savedSchemes,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get list of saved scheme IDs for rapid frontend active bookmark state checking
     */
    static async getMySavedSchemeIds(req, res, next) {
        try {
            if (!req.user) {
                return res.status(200).json({ success: true, data: [] });
            }
            const ids = await savedScheme_service_js_1.SavedSchemeService.getUserSavedSchemeIds(req.user._id.toString());
            res.status(200).json({
                success: true,
                data: ids,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Toggle save/unsave for a scheme
     */
    static async toggle(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }
            const { schemeId, notes } = req.body;
            if (!schemeId) {
                return res.status(400).json({ success: false, message: 'schemeId is required' });
            }
            const result = await savedScheme_service_js_1.SavedSchemeService.toggleSaveScheme(req.user._id.toString(), schemeId, notes);
            res.status(200).json({
                success: true,
                message: result.message,
                isSaved: result.isSaved,
                data: result.savedScheme,
            });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    /**
     * Check if specific scheme is saved
     */
    static async checkStatus(req, res, next) {
        try {
            if (!req.user) {
                return res.status(200).json({ success: true, isSaved: false });
            }
            const { schemeId } = req.params;
            const isSaved = await savedScheme_service_js_1.SavedSchemeService.isSchemeSaved(req.user._id.toString(), schemeId);
            res.status(200).json({
                success: true,
                isSaved,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Unsave a scheme
     */
    static async unsave(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }
            const { schemeId } = req.params;
            const success = await savedScheme_service_js_1.SavedSchemeService.unsaveScheme(req.user._id.toString(), schemeId);
            res.status(200).json({
                success,
                message: success ? 'Scheme removed from saved watchlist' : 'Scheme was not saved',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update personal notes for a saved scheme
     */
    static async updateNotes(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }
            const { schemeId } = req.params;
            const { notes } = req.body;
            const updated = await savedScheme_service_js_1.SavedSchemeService.updateNotes(req.user._id.toString(), schemeId, notes);
            res.status(200).json({
                success: true,
                message: 'Notes updated',
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SavedSchemeController = SavedSchemeController;
//# sourceMappingURL=savedScheme.controller.js.map