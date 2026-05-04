const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for order submissions.
 * 10 requests per 15 minutes per IP.
 */
const orderLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_ORDERS) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many order requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Rate limiter for contact/inquiry submissions.
 * 20 requests per 15 minutes per IP.
 */
const inquiryLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_INQUIRIES) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * General API rate limiter applied globally.
 * 200 requests per 15 minutes per IP.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please slow down.',
  },
});

module.exports = { orderLimiter, inquiryLimiter, globalLimiter };
