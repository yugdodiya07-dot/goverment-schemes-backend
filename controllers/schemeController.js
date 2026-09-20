const Scheme = require('../models/Scheme');
const User = require('../models/User');
const Application = require('../models/Application');

// Helper function: Calculate weighted eligibility score (0 to 100%)
const calculateWeightedEligibility = (userProfile, schemeCriteria) => {
  let score = 0;

  // 1. Age check (Weight: 20%)
  const userAge = userProfile.age || 25;
  const minAge = schemeCriteria.minAge !== undefined ? schemeCriteria.minAge : 0;
  const maxAge = schemeCriteria.maxAge !== undefined ? schemeCriteria.maxAge : 100;
  if (userAge >= minAge && userAge <= maxAge) {
    score += 20;
  } else if (userAge < minAge && minAge - userAge <= 3) {
    score += 10; // Partial match if close
  }

  // 2. Annual Income check (Weight: 20%)
  const userIncome = userProfile.annualIncome !== undefined && userProfile.annualIncome !== null ? userProfile.annualIncome : 300000;
  const maxIncome = schemeCriteria.maxIncome !== undefined ? schemeCriteria.maxIncome : 100000000;
  if (userIncome <= maxIncome) {
    score += 20;
  } else if (userIncome <= maxIncome * 1.25) {
    score += 10; // Partial match if within 25% margin
  }

  // 3. Occupation check (Weight: 20%)
  const userOccupation = (userProfile.occupation || '').toLowerCase();
  const schemeOccupations = (schemeCriteria.eligibleOccupations || ['All']).map((o) => o.toLowerCase());
  if (schemeOccupations.includes('all') || schemeOccupations.includes(userOccupation)) {
    score += 20;
  }

  // 4. Gender check (Weight: 10%)
  const userGender = (userProfile.gender || 'All').toLowerCase();
  const schemeGender = (schemeCriteria.gender || 'All').toLowerCase();
  if (schemeGender === 'all' || schemeGender === userGender) {
    score += 10;
  }

  // 5. State check (Weight: 10%)
  const userState = (userProfile.state || 'All').toLowerCase();
  const schemeStates = (schemeCriteria.eligibleStates || ['All']).map((s) => s.toLowerCase());
  if (schemeStates.includes('all') || schemeStates.includes(userState)) {
    score += 10;
  }

  // 6. Category check (Weight: 10%)
  const userCategory = (userProfile.category || 'All').toLowerCase();
  const schemeCategories = (schemeCriteria.eligibleCategories || ['All']).map((c) => c.toLowerCase());
  if (schemeCategories.includes('all') || schemeCategories.includes(userCategory)) {
    score += 10;
  }

  // 7. Disability Status check (Weight: 5%)
  const requiresDisability = schemeCriteria.requiresDisability || false;
  if (!requiresDisability || userProfile.disabilityStatus === true) {
    score += 5;
  }

  // 8. Special Status check (Weight: 5%)
  const requiredSpecial = (schemeCriteria.requiredSpecialStatus || []).map((s) => s.toLowerCase());
  const userSpecial = (userProfile.specialStatus || []).map((s) => s.toLowerCase());
  if (requiredSpecial.length === 0) {
    score += 5;
  } else {
    const hasSpecial = requiredSpecial.some((req) => userSpecial.includes(req));
    if (hasSpecial) {
      score += 5;
    }
  }

  return Math.min(100, Math.round(score));
};

// @desc    Get all schemes with advanced search, filter, sorting, and pagination
// @route   GET /api/schemes
// @access  Public
const getAllSchemes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      category = '',
      ministry = '',
      state = '',
      benefitType = '',
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = { isActive: true };

    // Search by title, shortDescription, ministry, or keywords
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { ministry: searchRegex },
        { category: searchRegex },
        { fullDescription: searchRegex },
        { benefitType: searchRegex },
      ];
    }

    if (category && category !== 'All' && category !== '') {
      let categoryRegex;
      const catLower = category.toLowerCase().trim();
      if (catLower === 'education') {
        categoryRegex = /Education|Scholarship|Student|School/i;
      } else if (catLower === 'agriculture') {
        categoryRegex = /Agriculture|Farmer|Rural|Kisan/i;
      } else if (catLower === 'women') {
        categoryRegex = /Women|Child|Female|Girl|Sukanya|Matru|Beti/i;
      } else if (catLower === 'health') {
        categoryRegex = /Health|Insurance|Arogya|Medical|Ayushman/i;
      } else if (catLower === 'employment') {
        categoryRegex = /Employment|Skill|Job|Internship|KVY|FutureSkills/i;
      } else if (catLower === 'business') {
        categoryRegex = /Business|Entrepreneur|MSME|Mudra|SVANidhi|Stand-Up|Artisan|Vishwakarma/i;
      } else if (catLower === 'senior citizen') {
        categoryRegex = /Senior|Pension|Retirement|APY|Vaya/i;
      } else if (catLower === 'divyangjan') {
        categoryRegex = /Divyang|Disability|Handicap/i;
      } else {
        categoryRegex = new RegExp(category.trim(), 'i');
      }

      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { category: categoryRegex },
          { title: categoryRegex },
          { shortDescription: categoryRegex },
          { ministry: categoryRegex },
          { 'eligibilityCriteria.eligibleCategories': categoryRegex },
        ],
      });
    }

    if (ministry && ministry !== '') {
      query.ministry = new RegExp(ministry, 'i');
    }

    if (benefitType && benefitType !== 'All' && benefitType !== '') {
      query.benefitType = benefitType;
    }

    if (state && state !== 'All' && state !== '') {
      query['eligibilityCriteria.eligibleStates'] = { $in: ['All', state] };
    }

    const totalItems = await Scheme.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const currentPage = Math.max(1, Math.min(Number(page), totalPages));

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const schemes = await Scheme.find(query)
      .sort(sortOptions)
      .skip((currentPage - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: schemes,
      pagination: {
        totalItems,
        totalPages,
        currentPage,
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scheme by ID
// @route   GET /api/schemes/:id
// @access  Public
const getSchemeById = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'The requested scheme could not be found.',
      });
    }

    res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check eligibility against all schemes using weighted 8-factor algorithm
// @route   POST /api/schemes/check-eligibility
// @access  Public
const checkEligibility = async (req, res, next) => {
  try {
    const userProfile = req.body || {};
    const allSchemes = await Scheme.find({ isActive: true });

    const evaluatedSchemes = allSchemes.map((scheme) => {
      const matchPercentage = calculateWeightedEligibility(userProfile, scheme.eligibilityCriteria || {});
      let badgeColor = 'red';
      let badgeText = 'Below 50% Match';

      if (matchPercentage === 100) {
        badgeColor = 'green';
        badgeText = '100% Eligible';
      } else if (matchPercentage >= 50) {
        badgeColor = 'orange';
        badgeText = '50–99% Match';
      }

      return {
        ...scheme.toObject(),
        matchPercentage,
        badgeColor,
        badgeText,
        eligibilityMessage:
          matchPercentage === 100
            ? 'You are 100% eligible for this scheme.'
            : `Your profile matches this scheme by ${matchPercentage}%.`,
      };
    });

    // Sort descending by match percentage
    evaluatedSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      data: evaluatedSchemes,
      summary: {
        totalChecked: evaluatedSchemes.length,
        eligible100: evaluatedSchemes.filter((s) => s.matchPercentage === 100).length,
        partialMatch: evaluatedSchemes.filter((s) => s.matchPercentage >= 50 && s.matchPercentage < 100).length,
        lowMatch: evaluatedSchemes.filter((s) => s.matchPercentage < 50).length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new scheme (Admin Only)
// @route   POST /api/schemes
// @access  Private/Admin
const createScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Government Scheme created successfully!',
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a scheme (Admin Only)
// @route   PUT /api/schemes/:id
// @access  Private/Admin
const updateScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Government Scheme updated successfully!',
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Deactivate a scheme (Admin Only)
// @route   DELETE /api/schemes/:id
// @access  Private/Admin
const deleteScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    // Referential integrity check: prevent deletion if active or historical applications exist
    const applicationCount = await Application.countDocuments({ scheme: req.params.id });
    if (applicationCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete scheme because ${applicationCount} application(s) reference it. You can deactivate the scheme instead.`,
      });
    }

    await Scheme.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Government Scheme removed successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Save/Bookmark Scheme for Citizen (Atomic Operation)
// @route   POST /api/schemes/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const schemeId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const isAlreadySaved = user.savedSchemes.some((id) => id.toString() === schemeId);

    let updatedUser;
    if (isAlreadySaved) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { savedSchemes: schemeId } },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { savedSchemes: schemeId } },
        { new: true }
      );
    }

    const bookmarked = !isAlreadySaved;

    res.status(200).json({
      success: true,
      bookmarked,
      message: bookmarked ? 'Scheme saved to your bookmarks!' : 'Scheme removed from your bookmarks.',
      savedSchemes: updatedUser.savedSchemes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSchemes,
  getSchemeById,
  checkEligibility,
  createScheme,
  updateScheme,
  deleteScheme,
  toggleBookmark,
};
