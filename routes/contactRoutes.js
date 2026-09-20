const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');

router.route('/')
  .post(apiLimiter, submitContactMessage)
  .get(protect, adminOnly, getContactMessages);

router.route('/:id')
  .put(protect, adminOnly, updateContactMessageStatus)
  .delete(protect, adminOnly, deleteContactMessage);

module.exports = router;
