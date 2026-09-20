import { IEligibilityCriteria, IWeightedScoreResult } from '../types/index.js';
import { Scheme } from '../models/Scheme.js';

export class EligibilityService {
  /**
   * Evaluates a user profile against scheme criteria using an 8-Factor Weighted Model.
   * Total Weight = 100%
   * - Age (20%)
   * - Income (20%)
   * - Occupation (20%)
   * - Gender (10%)
   * - State (10%)
   * - Social Category (10%)
   * - Disability Status (5%)
   * - Special Status (5%)
   */
  public static calculateMatch(profile: Record<string, any>, criteria: IEligibilityCriteria): IWeightedScoreResult {
    const matchedRules: string[] = [];
    const unmatchedRules: string[] = [];
    const disqualifications: string[] = [];

    // 1. Mandatory Gate: Age Bracket (Weight: 20%)
    const userAge = Number(profile.age) || 25;
    const minAge = criteria.minAge ?? 0;
    const maxAge = criteria.maxAge ?? 115;
    let agePassed = false;
    let ageScore = 0;

    if (userAge >= minAge && userAge <= maxAge) {
      agePassed = true;
      ageScore = 20;
      matchedRules.push(`Age (${userAge} yrs) satisfies required age bracket (${minAge}–${maxAge} yrs)`);
    } else {
      disqualifications.push(
        `Age Mismatch: Scheme requires age between ${minAge} and ${maxAge} yrs (Applicant is ${userAge} yrs).`
      );
      unmatchedRules.push(`Age (${userAge} yrs) outside required bracket (${minAge}–${maxAge} yrs)`);
    }

    // 2. Mandatory Gate: Annual Income Ceiling (Weight: 20%)
    const userIncome = profile.annualIncome !== undefined ? Number(profile.annualIncome) : 0;
    const maxIncome = criteria.maxIncome ?? 100000000;
    let incomePassed = false;
    let incomeScore = 0;

    if (userIncome <= maxIncome) {
      incomePassed = true;
      incomeScore = 20;
      matchedRules.push(
        `Annual income (₹${userIncome.toLocaleString('en-IN')}) is within permissible ceiling of ₹${maxIncome.toLocaleString('en-IN')}`
      );
    } else {
      disqualifications.push(
        `Income Ceiling Exceeded: Scheme requires family income under ₹${maxIncome.toLocaleString('en-IN')} (Applicant income: ₹${userIncome.toLocaleString('en-IN')}).`
      );
      unmatchedRules.push(`Income exceeds maximum permissible limit (₹${maxIncome.toLocaleString('en-IN')})`);
    }

    // 3. Mandatory Gate: Eligible Occupation (Weight: 20%)
    const userOccupation = (profile.occupation || '').trim().toLowerCase();
    const eligibleOccupations = (criteria.eligibleOccupations || ['All']).map((o) => o.trim().toLowerCase());
    let occPassed = false;
    let occScore = 0;

    if (eligibleOccupations.includes('all') || eligibleOccupations.includes(userOccupation)) {
      occPassed = true;
      occScore = 20;
      matchedRules.push(`Occupation (${profile.occupation || 'General'}) is directly eligible`);
    } else {
      disqualifications.push(
        `Occupation Ineligible: Scheme strictly requires occupation to be [${(criteria.eligibleOccupations || []).join(', ')}] (Applicant occupation: ${profile.occupation || 'None'}).`
      );
      unmatchedRules.push(`Scheme requires specific occupations (${(criteria.eligibleOccupations || []).join(', ')})`);
    }

    // 4. Mandatory Gate: Gender Restriction (Weight: 10%)
    const userGender = (profile.gender || 'all').trim().toLowerCase();
    const eligibleGender = (criteria.gender || 'All').trim().toLowerCase();
    let genderPassed = false;
    let genderScore = 0;

    if (eligibleGender === 'all' || eligibleGender === userGender) {
      genderPassed = true;
      genderScore = 10;
      matchedRules.push(`Gender requirement matched (${criteria.gender || 'All'})`);
    } else {
      disqualifications.push(
        `Gender Restriction: Scheme is exclusively reserved for ${criteria.gender} beneficiaries (Applicant is ${profile.gender}).`
      );
      unmatchedRules.push(`Scheme restricted to ${criteria.gender} beneficiaries`);
    }

    // 5. Mandatory Gate: State / UT Domicile (Weight: 10%)
    const userState = (profile.state || 'National').trim().toLowerCase();
    const eligibleStates = (criteria.eligibleStates || ['All']).map((s) => s.trim().toLowerCase());
    let statePassed = false;
    let stateScore = 0;

    if (eligibleStates.includes('all') || userState === 'national' || eligibleStates.includes(userState)) {
      statePassed = true;
      stateScore = 10;
      matchedRules.push(`State domicile (${profile.state || 'National'}) is eligible`);
    } else {
      disqualifications.push(
        `State Restriction: Scheme is restricted to residents of: ${(criteria.eligibleStates || []).join(', ')}.`
      );
      unmatchedRules.push(`Applicable only for selected states: ${(criteria.eligibleStates || []).join(', ')}`);
    }

    // 6. Mandatory Gate: Social Category (Weight: 10%)
    const userCat = (profile.category || 'General').trim().toLowerCase();
    const eligibleCats = (criteria.eligibleCategories || ['All']).map((c) => c.trim().toLowerCase());
    let catPassed = false;
    let catScore = 0;

    if (eligibleCats.includes('all') || eligibleCats.includes(userCat)) {
      catPassed = true;
      catScore = 10;
      matchedRules.push(`Social category (${profile.category || 'All'}) is eligible`);
    } else {
      disqualifications.push(
        `Category Restriction: Scheme is reserved for [${(criteria.eligibleCategories || []).join(', ')}] categories.`
      );
      unmatchedRules.push(`Scheme restricted to ${(criteria.eligibleCategories || []).join(', ')} categories`);
    }

    // 7. Mandatory Gate: Disability Quota (Weight: 5%)
    const requiresDisability = criteria.requiresDisability || false;
    const userDisability = Boolean(profile.disabilityStatus);
    let disPassed = false;
    let disScore = 0;

    if (!requiresDisability || userDisability) {
      disPassed = true;
      disScore = 5;
      matchedRules.push(requiresDisability ? `Mandatory Divyangjan benchmark met` : `Open to all ability statuses`);
    } else {
      disqualifications.push(`Disability Quota: Scheme specifically targets Persons with Disabilities (UDID card required).`);
      unmatchedRules.push(`Scheme specifically targets Persons with Disabilities (PwD)`);
    }

    // 8. Mandatory Gate: Special Status Factor (Weight: 5%)
    const requiredSpecial = (criteria.requiredSpecialStatus || []).map((s) => s.trim().toLowerCase());
    const userSpecial = Array.isArray(profile.specialStatus)
      ? profile.specialStatus.map((s: string) => s.trim().toLowerCase())
      : [];
    // User occupation and gender can inherently fulfill matching special conditions
    const effectiveSpecial = new Set([...userSpecial, userOccupation]);
    if (userGender === 'female' && userAge <= 18) effectiveSpecial.add('girl child');

    let specPassed = false;
    let specScore = 0;

    if (requiredSpecial.length === 0) {
      specPassed = true;
      specScore = 5;
    } else {
      const match = requiredSpecial.some((req) => effectiveSpecial.has(req));
      if (match) {
        specPassed = true;
        specScore = 5;
        matchedRules.push(`Special status requirements verified (${(criteria.requiredSpecialStatus || []).join(', ')})`);
      } else {
        disqualifications.push(
          `Special Attribute Required: Scheme requires [${(criteria.requiredSpecialStatus || []).join(', ')}] qualification.`
        );
        unmatchedRules.push(`Requires special status: ${(criteria.requiredSpecialStatus || []).join(', ')}`);
      }
    }

    // Statutory Eligibility Determination:
    // User is ONLY eligible if ALL mandatory statutory gates pass with ZERO disqualifications.
    const isEligible = disqualifications.length === 0;

    let finalScore = 0;
    if (isEligible) {
      finalScore = ageScore + incomeScore + occScore + genderScore + stateScore + catScore + disScore + specScore;
      finalScore = Math.min(100, Math.max(80, Math.round(finalScore)));
    } else {
      // For disqualified schemes, calculate partial score (capped strictly at 35%) so users clearly see they are ineligible
      const passedCount = [agePassed, incomePassed, occPassed, genderPassed, statePassed, catPassed, disPassed, specPassed].filter(Boolean).length;
      finalScore = Math.round((passedCount / 8) * 35);
    }

    return {
      score: finalScore,
      isEligible,
      disqualifications,
      breakdown: {
        age: { score: ageScore, max: 20, passed: agePassed },
        income: { score: incomeScore, max: 20, passed: incomePassed },
        occupation: { score: occScore, max: 20, passed: occPassed },
        gender: { score: genderScore, max: 10, passed: genderPassed },
        state: { score: stateScore, max: 10, passed: statePassed },
        category: { score: catScore, max: 10, passed: catPassed },
        disability: { score: disScore, max: 5, passed: disPassed },
        specialStatus: { score: specScore, max: 5, passed: specPassed },
      },
      matchedRules,
      unmatchedRules,
    };
  }

  /**
   * Batch evaluates all active schemes for a given user profile.
   */
  public static async evaluateAllSchemes(profile: Record<string, any>) {
    const activeSchemes = await Scheme.find({ status: 'Active' }).populate('category');

    const results = activeSchemes.map((scheme) => {
      const match = this.calculateMatch(profile, scheme.eligibilityCriteria);
      return {
        scheme,
        score: match.score,
        isEligible: match.isEligible,
        disqualifications: match.disqualifications,
        breakdown: match.breakdown,
        matchedRules: match.matchedRules,
        unmatchedRules: match.unmatchedRules,
      };
    });

    // Sort: Eligible schemes first (sorted by score descending), followed by disqualified schemes
    results.sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return b.score - a.score;
    });

    return results;
  }

  /**
   * Validates profile for statutory consistency and real-world conflicts.
   */
  public static validateProfileConsistency(profile: Record<string, any>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const age = Number(profile.age) || 0;
    const income = Number(profile.annualIncome) || 0;
    const gender = (profile.gender || '').toLowerCase();
    const occupation = (profile.occupation || '').toLowerCase();
    const category = (profile.category || '').toUpperCase();
    const specialStatus = Array.isArray(profile.specialStatus)
      ? profile.specialStatus.map((s: string) => s.toLowerCase())
      : [];

    // 0. Age Validity Check
    if (isNaN(age) || age <= 0) {
      errors.push(
        'Statutory Rejection: Applicant age must be at least 1 completed year (1-115). Applications for newborn infants are processed under parent/maternal welfare schemes.'
      );
    } else if (age > 115) {
      errors.push(
        'Statutory Advisory: Applicant age exceeds valid civic registry limit (115 years). Please enter a verified age.'
      );
    }

    // 1. Age vs Child Labour / Adult occupation
    if (age > 0 && age < 14 && !['student', 'child', 'unemployed'].includes(occupation)) {
      errors.push(
        'Under the Child Labour (Prohibition & Regulation) Act, applicants under 14 cannot be registered under adult commercial trades (Farmer, Artisan, Vendor, Business). Please select "Student".'
      );
    }

    // 2. Minor Business Ownership / Commercial Credit
    if (age < 18 && ['business owner', 'self-employed'].includes(occupation)) {
      warnings.push(
        'Applicants under 18 cannot independently sign institutional credit agreements without an authorized parent or legal guardian.'
      );
    }

    // 3. Gender vs Female-specific special status
    if (gender === 'male' && (specialStatus.includes('girl child') || specialStatus.includes('single mother'))) {
      errors.push(
        'Incompatible selection: Female-restricted criteria ("Girl Child" / "Single Mother") selected for a Male applicant profile.'
      );
    }

    // 4. EWS income cap
    if (category === 'EWS' && income > 800000) {
      errors.push(
        `EWS (Economically Weaker Section) criteria requires annual family income to be strictly under ₹8,00,000 (Your input: ₹${income.toLocaleString('en-IN')}).`
      );
    }

    // 5. Senior citizen notice
    if (age >= 60 && occupation === 'student') {
      warnings.push(
        'Senior citizens (60+) typically do not qualify for youth apprenticeship programs (capped at 35), but are eligible for Atal Pension and Senior Social Security.'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
