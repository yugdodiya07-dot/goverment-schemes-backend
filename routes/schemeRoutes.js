const express = require('express');
const router = express.Router();
const {
  getAllSchemes,
  getSchemeById,
  checkEligibility,
  createScheme,
  updateScheme,
  deleteScheme,
  toggleBookmark,
} = require('../controllers/schemeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllSchemes);
router.post('/check-eligibility', checkEligibility);
router.get('/:id', getSchemeById);
router.post('/:id/bookmark', protect, toggleBookmark);

// Admin only CRUD
router.post('/', protect, adminOnly, createScheme);
router.put('/:id', protect, adminOnly, updateScheme);
router.delete('/:id', protect, adminOnly, deleteScheme);

module.exports = router;
