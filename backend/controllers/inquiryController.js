const Inquiry = require('../models/Inquiry');
const { sendInquiryAlert } = require('../utils/emailService');

// @desc    Create new inquiry
// @route   POST /api/contact
// @access  Public
const createInquiry = async (req, res, next) => {
  try {
    const inquiry = new Inquiry(req.body);
    const createdInquiry = await inquiry.save();

    // Send email alert
    await sendInquiryAlert(createdInquiry);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (for admin)
// @route   GET /api/contact
// @access  Private (Placeholder for now)
const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({}).sort('-createdAt');
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    next(error);
  }
};

module.exports = { createInquiry, getInquiries };
