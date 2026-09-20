"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityController = void 0;
const eligibility_service_js_1 = require("../services/eligibility.service.js");
const EligibilityHistory_js_1 = require("../models/EligibilityHistory.js");
class EligibilityController {
    static async checkEligibility(req, res, next) {
        try {
            const profile = req.body;
            const evaluatedSchemes = await eligibility_service_js_1.EligibilityService.evaluateAllSchemes(profile);
            const eligibleSchemes = evaluatedSchemes.filter((item) => item.isEligible);
            // Save to history asynchronously
            if (req.user) {
                EligibilityHistory_js_1.EligibilityHistory.create({
                    user: req.user._id,
                    searchCriteria: profile,
                    eligibleSchemesCount: eligibleSchemes.length,
                    topMatchedSchemes: evaluatedSchemes.slice(0, 5).map((item) => ({
                        schemeId: item.scheme._id,
                        title: item.scheme.title,
                        score: item.score,
                    })),
                    ipAddress: req.ip,
                }).catch((err) => console.error('Failed to log eligibility history:', err));
            }
            res.status(200).json({
                success: true,
                data: {
                    totalEvaluated: evaluatedSchemes.length,
                    eligibleCount: eligibleSchemes.length,
                    schemes: evaluatedSchemes,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.EligibilityController = EligibilityController;
//# sourceMappingURL=eligibility.controller.js.map