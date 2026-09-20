"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityService = void 0;
const Scheme_js_1 = require("../models/Scheme.js");
class EligibilityService {
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
    static calculateMatch(profile, criteria) {
        let score = 0;
        const matchedRules = [];
        const unmatchedRules = [];
        // 1. Age Factor (20%)
        const userAge = Number(profile.age) || 25;
        const minAge = criteria.minAge ?? 0;
        const maxAge = criteria.maxAge ?? 100;
        let ageScore = 0;
        let agePassed = false;
        if (userAge >= minAge && userAge <= maxAge) {
            ageScore = 20;
            agePassed = true;
            matchedRules.push(`Age (${userAge} yrs) is within eligible range (${minAge}-${maxAge} yrs)`);
        }
        else if (userAge < minAge && minAge - userAge <= 3) {
            ageScore = 10;
            unmatchedRules.push(`Age is near the minimum threshold (${minAge} yrs)`);
        }
        else {
            unmatchedRules.push(`Age (${userAge} yrs) outside required bracket (${minAge}-${maxAge} yrs)`);
        }
        score += ageScore;
        // 2. Annual Income Factor (20%)
        const userIncome = profile.annualIncome !== undefined ? Number(profile.annualIncome) : 250000;
        const maxIncome = criteria.maxIncome ?? 100000000;
        let incomeScore = 0;
        let incomePassed = false;
        if (userIncome <= maxIncome) {
            incomeScore = 20;
            incomePassed = true;
            matchedRules.push(`Income (₹${userIncome.toLocaleString('en-IN')}) meets ceiling of ₹${maxIncome.toLocaleString('en-IN')}`);
        }
        else if (userIncome <= maxIncome * 1.2) {
            incomeScore = 10;
            unmatchedRules.push(`Income slightly exceeds threshold`);
        }
        else {
            unmatchedRules.push(`Income exceeds maximum permissible limit (₹${maxIncome.toLocaleString('en-IN')})`);
        }
        score += incomeScore;
        // 3. Occupation Factor (20%)
        const userOccupation = (profile.occupation || 'all').toLowerCase();
        const eligibleOccupations = (criteria.eligibleOccupations || ['All']).map((o) => o.toLowerCase());
        let occScore = 0;
        let occPassed = false;
        if (eligibleOccupations.includes('all') || eligibleOccupations.includes(userOccupation)) {
            occScore = 20;
            occPassed = true;
            matchedRules.push(`Occupation (${profile.occupation || 'Any'}) is eligible`);
        }
        else {
            unmatchedRules.push(`Scheme requires specific occupations (${(criteria.eligibleOccupations || []).join(', ')})`);
        }
        score += occScore;
        // 4. Gender Factor (10%)
        const userGender = (profile.gender || 'all').toLowerCase();
        const eligibleGender = (criteria.gender || 'All').toLowerCase();
        let genderScore = 0;
        let genderPassed = false;
        if (eligibleGender === 'all' || eligibleGender === userGender) {
            genderScore = 10;
            genderPassed = true;
            matchedRules.push(`Gender requirement matched`);
        }
        else {
            unmatchedRules.push(`Scheme restricted to ${criteria.gender} beneficiaries`);
        }
        score += genderScore;
        // 5. State / Region Factor (10%)
        const userState = (profile.state || 'all').toLowerCase();
        const eligibleStates = (criteria.eligibleStates || ['All']).map((s) => s.toLowerCase());
        let stateScore = 0;
        let statePassed = false;
        if (eligibleStates.includes('all') || eligibleStates.includes(userState)) {
            stateScore = 10;
            statePassed = true;
            matchedRules.push(`State (${profile.state || 'National'}) is eligible`);
        }
        else {
            unmatchedRules.push(`Applicable only for selected states: ${(criteria.eligibleStates || []).join(', ')}`);
        }
        score += stateScore;
        // 6. Social Category Factor (10%)
        const userCat = (profile.category || 'all').toLowerCase();
        const eligibleCats = (criteria.eligibleCategories || ['All']).map((c) => c.toLowerCase());
        let catScore = 0;
        let catPassed = false;
        if (eligibleCats.includes('all') || eligibleCats.includes(userCat)) {
            catScore = 10;
            catPassed = true;
            matchedRules.push(`Category (${profile.category || 'All'}) is covered`);
        }
        else {
            unmatchedRules.push(`Scheme restricted to ${(criteria.eligibleCategories || []).join(', ')} categories`);
        }
        score += catScore;
        // 7. Disability Status Factor (5%)
        const requiresDisability = criteria.requiresDisability || false;
        const userDisability = Boolean(profile.disabilityStatus);
        let disScore = 0;
        let disPassed = false;
        if (!requiresDisability || userDisability) {
            disScore = 5;
            disPassed = true;
            matchedRules.push(`Disability requirements met`);
        }
        else {
            unmatchedRules.push(`Scheme specifically targets Persons with Disabilities (PwD)`);
        }
        score += disScore;
        // 8. Special Status Factor (5%)
        const requiredSpecial = (criteria.requiredSpecialStatus || []).map((s) => s.toLowerCase());
        const userSpecial = Array.isArray(profile.specialStatus) ? profile.specialStatus.map((s) => s.toLowerCase()) : [];
        let specScore = 0;
        let specPassed = false;
        if (requiredSpecial.length === 0) {
            specScore = 5;
            specPassed = true;
        }
        else {
            const match = requiredSpecial.some((req) => userSpecial.includes(req));
            if (match) {
                specScore = 5;
                specPassed = true;
                matchedRules.push(`Special status requirements verified`);
            }
            else {
                unmatchedRules.push(`Requires special status: ${(criteria.requiredSpecialStatus || []).join(', ')}`);
            }
        }
        score += specScore;
        const finalScore = Math.min(100, Math.round(score));
        return {
            score: finalScore,
            isEligible: finalScore >= 60,
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
    static async evaluateAllSchemes(profile) {
        const activeSchemes = await Scheme_js_1.Scheme.find({ status: 'Active' }).populate('category');
        const results = activeSchemes.map((scheme) => {
            const match = this.calculateMatch(profile, scheme.eligibilityCriteria);
            return {
                scheme,
                score: match.score,
                isEligible: match.isEligible,
                breakdown: match.breakdown,
                matchedRules: match.matchedRules,
                unmatchedRules: match.unmatchedRules,
            };
        });
        // Sort by descending score
        results.sort((a, b) => b.score - a.score);
        return results;
    }
}
exports.EligibilityService = EligibilityService;
//# sourceMappingURL=eligibility.service.js.map