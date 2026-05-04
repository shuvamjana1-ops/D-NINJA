const Inquiry = require('../models/Inquiry');
const { sendInquiryAlert } = require('../utils/emailService');

// ─────────────────────────────────────────────
// @desc    Create a new inquiry
// @route   POST /api/contact
// @access  Public
// ─────────────────────────────────────────────
const createInquiry = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const inquiry = new Inquiry({ name, email, subject, message });
    const createdInquiry = await inquiry.save();

    // Non-blocking email alert — don't fail the response if email errors
    sendInquiryAlert(createdInquiry).catch(err =>
      console.error('❌ Inquiry email background error:', err.message)
    );

    res.status(201).json({
      success: true,
      message: "Your message has been received. We'll be in touch soon!",
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get all inquiries
// @route   GET /api/contact
// @access  Private (Admin)
// ─────────────────────────────────────────────
const getInquiries = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)   || 1;
    const limit  = parseInt(req.query.limit)  || 20;
    const status = req.query.status; // optional filter: unread | read | responded
    const skip   = (page - 1) * limit;

    const filter = status ? { status } : {};

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter).sort('-createdAt').skip(skip).limit(limit),
      Inquiry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      count: inquiries.length,
      total,
      inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get a single inquiry by ID
// @route   GET /api/contact/:id
// @access  Private (Admin)
// ─────────────────────────────────────────────
const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found.');
    }
    res.json({ success: true, inquiry });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400);
      return next(new Error('Invalid inquiry ID format.'));
    }
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Update inquiry read status
// @route   PATCH /api/contact/:id/status
// @access  Private (Admin)
// ─────────────────────────────────────────────
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['unread', 'read', 'responded'];

    if (!valid.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${valid.join(', ')}`);
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found.');
    }

    res.json({ success: true, message: 'Inquiry status updated.', inquiry });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400);
      return next(new Error('Invalid inquiry ID format.'));
    }
    next(error);
  }
};

module.exports = { createInquiry, getInquiries, getInquiryById, updateInquiryStatus };
