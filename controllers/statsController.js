const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Application = require('../models/Application');

// @desc    Get portal statistics for Admin Dashboard (10 Metrics & Tables)
// @route   GET /api/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'citizen' });
    const activeUsers = await User.countDocuments({ role: 'citizen', status: 'Active' });
    const blockedUsers = await User.countDocuments({ role: 'citizen', status: 'Blocked' });

    const totalSchemes = await Scheme.countDocuments({ isActive: true });

    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({
      status: { $in: ['Submitted', 'Under Verification', 'Document Verified'] },
    });
    const approvedApplications = await Application.countDocuments({ status: 'Approved' });
    const rejectedApplications = await Application.countDocuments({ status: 'Rejected' });

    // Recent 5 citizen registrations
    const recentRegistrations = await User.find({ role: 'citizen' })
      .select('name email phone state createdAt status')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 applications submitted
    const recentApplications = await Application.find()
      .populate('scheme', 'title code category')
      .populate('user', 'name email phone')
      .select('applicantName email phone status createdAt remarks')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        blockedUsers,
        totalSchemes,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
      },
      recentRegistrations,
      recentApplications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public portal statistics for Home Page ticker
// @route   GET /api/stats/public
// @access  Public
const getPublicStats = async (req, res, next) => {
  try {
    const totalSchemes = await Scheme.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();
    const approvedApplications = await Application.countDocuments({ status: 'Approved' });

    res.status(200).json({
      success: true,
      data: {
        totalSchemes: Math.max(totalSchemes, 12),
        totalApplications: Math.max(totalApplications, 12450),
        approvedApplications: Math.max(approvedApplications, 9820),
        fundDisbursedCr: 4500, // Display ₹4,500+ Cr across India
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getPublicStats,
};
