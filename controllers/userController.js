const User = require('../models/User');
const Application = require('../models/Application');

// @desc    Get all users with search, filtering, and pagination (Admin Only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 15,
      search = '',
      status = '',
      category = '',
      occupation = '',
      role = 'citizen',
    } = req.query;

    const query = {};
    if (role && role !== 'All' && role !== '') {
      query.role = role;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { state: searchRegex },
        { district: searchRegex },
      ];
    }

    if (status && status !== 'All' && status !== '') {
      query.status = status;
    }

    if (category && category !== 'All' && category !== '') {
      query.category = category;
    }

    if (occupation && occupation !== 'All' && occupation !== '') {
      query.occupation = occupation;
    }

    const totalItems = await User.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const currentPage = Math.max(1, Math.min(Number(page), totalPages));

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: users,
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

// @desc    Get single user profile and their submitted applications (Admin Only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const applications = await Application.find({ user: user._id })
      .populate('scheme', 'title code benefitAmount category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (Active / Blocked) (Admin Only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['Active', 'Blocked', 'Deleted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status: Active, Blocked, or Deleted.',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify status of an Admin user.',
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status updated to ${status} successfully!`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete a user (sets status to 'Deleted') (Admin Only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete an Admin account.',
      });
    }

    // Soft delete: update status to 'Deleted' so application history remains preserved
    user.status = 'Deleted';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User account soft-deleted successfully. Historical applications have been preserved.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
};
