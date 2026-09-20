const express = require('express');
const router = express.Router();
const { getAdminStats, getPublicStats } = require('../controllers/statsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAdminStats);
router.get('/public', getPublicStats);

module.exports = router;
