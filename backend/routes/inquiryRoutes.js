const express = require('express');
const router = express.Router();

const {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
} = require('../controllers/inquiryController');

const { validateInquiry } = require('../middleware/validation');
const { adminAuth }        = require('../middleware/auth');
const { inquiryLimiter }   = require('../middleware/rateLimiter');

// Public — submit a contact inquiry (rate limited + validated)
router.post('/', inquiryLimiter, validateInquiry, createInquiry);

// Admin — list all inquiries (paginated, optional ?status= filter)
router.get('/', adminAuth, getInquiries);

// Admin — get single inquiry
router.get('/:id', adminAuth, getInquiryById);

// Admin — update inquiry read/responded status
router.patch('/:id/status', adminAuth, updateInquiryStatus);

module.exports = router;
