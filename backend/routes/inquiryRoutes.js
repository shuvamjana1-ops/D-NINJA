const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries } = require('../controllers/inquiryController');
const { validateInquiry } = require('../middleware/validation');

router.post('/', validateInquiry, createInquiry);
router.get('/', getInquiries); // Note: Should be protected in production

module.exports = router;
