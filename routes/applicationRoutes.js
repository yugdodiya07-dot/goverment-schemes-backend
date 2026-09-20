const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.array('documents', 5), submitApplication);
router.get('/my-applications', protect, getMyApplications);

// Admin only routes
router.get('/', protect, adminOnly, getAllApplications);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);
router.delete('/:id', protect, adminOnly, deleteApplication);

module.exports = router;
