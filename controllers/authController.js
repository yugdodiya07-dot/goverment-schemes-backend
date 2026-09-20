const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'govsmart_super_secret_jwt_key_2026_india',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    }
  );
};

// @desc    Register a new Citizen
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      age,
      gender,
      state,
      district,
      address,
      annualIncome,
      occupation,
      category,
      disabilityStatus,
      specialStatus,
    } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Password, and Mobile Number are required fields.',
      });
    }

    // Prevent duplicate email registration
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'This email address is already registered. Please login or use another email.',
      });
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and include at least one letter and one number.',
      });
    }

    // Create Citizen user (role defaults to 'citizen')
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'citizen',
      phone,
      age: age ? Number(age) : null,
      gender: gender || '',
      state: state || '',
      district: district || '',
      address: address || '',
      annualIncome: annualIncome ? Number(annualIncome) : null,
      occupation: occupation || '',
      category: category || '',
      disabilityStatus: Boolean(disabilityStatus),
      specialStatus: Array.isArray(specialStatus) ? specialStatus : specialStatus ? [specialStatus] : [],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Citizen registration successful! Welcome to GovSmart India.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        address: user.address,
        age: user.age,
        gender: user.gender,
        annualIncome: user.annualIncome,
        occupation: user.occupation,
        category: user.category,
        disabilityStatus: user.disabilityStatus,
        specialStatus: user.specialStatus,
        profilePhoto: user.profilePhoto,
        savedSchemes: user.savedSchemes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login Citizen or Admin with granular error messages
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if user exists by email (User model or Admin model)
    let user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      user = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    // Check if account is Blocked or Deleted
    if (user.status === 'Blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked by the Government Portal Administrator.',
      });
    }

    if (user.status === 'Deleted') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    // Match password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `Login successful! Welcome back, ${user.name}.`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        address: user.address,
        age: user.age,
        gender: user.gender,
        annualIncome: user.annualIncome,
        occupation: user.occupation,
        category: user.category,
        disabilityStatus: user.disabilityStatus,
        specialStatus: user.specialStatus,
        profilePhoto: user.profilePhoto,
        savedSchemes: user.savedSchemes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id).populate('savedSchemes');
    if (!user) {
      user = await Admin.findById(req.user._id);
    }
    if (!user) {
      user = req.user;
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & photo
// @route   PUT /api/auth/update-profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Updatable fields
    const fields = [
      'name',
      'phone',
      'address',
      'state',
      'district',
      'age',
      'gender',
      'annualIncome',
      'occupation',
      'category',
      'disabilityStatus',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.specialStatus !== undefined) {
      user.specialStatus = Array.isArray(req.body.specialStatus)
        ? req.body.specialStatus
        : req.body.specialStatus
        ? [req.body.specialStatus]
        : [];
    }

    if (req.file) {
      user.profilePhoto = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify User ID & Registered Phone Number for Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { userId, email, phone } = req.body;
    const identifier = (userId || email || '').trim();
    const inputPhone = (phone || '').trim().replace(/^\+91/, '');

    if (!identifier || !inputPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both your User ID and registered Phone Number.',
      });
    }

    let query = { email: identifier.toLowerCase() };
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { $or: [{ email: identifier.toLowerCase() }, { _id: identifier }] };
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID or registered Phone Number.',
      });
    }

    const registeredPhone = (user.phone || '').trim().replace(/^\+91/, '');

    if (!registeredPhone || registeredPhone !== inputPhone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID or registered Phone Number.',
      });
    }

    // Generate temporary verification reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Account verified successfully. You can now set your new password.',
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using verified reset token or User ID + Phone Number
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, userId, email, phone, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password.',
      });
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and include at least one letter and one number.',
      });
    }

    let user = null;

    if (resetToken) {
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
    }

    // Verification check by userId and phone if resetToken wasn't passed or expired
    if (!user && (userId || email) && phone) {
      const identifier = (userId || email || '').trim();
      const inputPhone = (phone || '').trim().replace(/^\+91/, '');

      let query = { email: identifier.toLowerCase() };
      if (mongoose.Types.ObjectId.isValid(identifier)) {
        query = { $or: [{ email: identifier.toLowerCase() }, { _id: identifier }] };
      }

      const foundUser = await User.findOne(query);
      if (foundUser) {
        const registeredPhone = (foundUser.phone || '').trim().replace(/^\+91/, '');
        if (registeredPhone && registeredPhone === inputPhone) {
          user = foundUser;
        }
      }
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID or registered Phone Number.',
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
};
