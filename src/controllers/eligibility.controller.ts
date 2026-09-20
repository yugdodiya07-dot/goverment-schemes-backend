import { Response, NextFunction } from 'express';
import { EligibilityService } from '../services/eligibility.service.js';
import { EligibilityHistory } from '../models/EligibilityHistory.js';
import { AuthenticatedRequest } from '../types/index.js';

export class EligibilityController {
  public static async checkEligibility(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = req.body;

      // Validate statutory consistency
      const validation = EligibilityService.validateProfileConsistency(profile);
      if (!validation.isValid) {
        return res.status(422).json({
          success: false,
          message: 'Profile contains conflicting or invalid criteria',
          errors: validation.errors,
          warnings: validation.warnings,
        });
      }

      const evaluatedSchemes = await EligibilityService.evaluateAllSchemes(profile);

      const eligibleSchemes = evaluatedSchemes.filter((item) => item.isEligible);
      const ineligibleSchemes = evaluatedSchemes.filter((item) => !item.isEligible);

      // Save to history asynchronously
      if (req.user) {
        EligibilityHistory.create({
          user: req.user._id,
          searchCriteria: profile,
          eligibleSchemesCount: eligibleSchemes.length,
          topMatchedSchemes: eligibleSchemes.slice(0, 5).map((item) => ({
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
          ineligibleCount: ineligibleSchemes.length,
          eligibleSchemes,
          ineligibleSchemes,
          schemes: evaluatedSchemes,
          warnings: validation.warnings,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
