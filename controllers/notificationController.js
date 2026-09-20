const Notification = require('../models/Notification');

// Default system welcome notifications if DB is empty for this user
const getDefaultNotifications = () => [
  {
    _id: 'default-1',
    title: 'Welcome to GovSmart India!',
    message: 'Explore over 120+ flagship government welfare schemes tailored to your demographic profile.',
    type: 'System',
    link: '/schemes',
    read: false,
    createdAt: new Date(),
  },
  {
    _id: 'default-2',
    title: 'PM Kisan Samman Nidhi Application Open',
    message: 'Check your eligibility for annual income support of ₹6,000 in 3 installments.',
    type: 'Scheme',
    link: '/schemes',
    read: false,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    _id: 'default-3',
    title: 'Complete Your KYC Profile',
    message: 'Add your Aadhaar & demographic information to unlock instant 8-factor AI eligibility scores.',
    type: 'Profile',
    link: '/dashboard',
    read: false,
    createdAt: new Date(Date.now() - 86400000),
  },
];

// @desc    Get current user notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      $or: [{ recipient: req.user._id }, { recipient: null }, { recipient: { $exists: false } }],
    }).sort({ createdAt: -1 });

    const results = notifications.length > 0 ? notifications : getDefaultNotifications();

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      notification.read = true;
      await notification.save();
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        $or: [{ recipient: req.user._id }, { recipient: null }, { recipient: { $exists: false } }],
        read: false,
      },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead,
};
