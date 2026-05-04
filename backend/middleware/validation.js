const { body, validationResult } = require('express-validator');

const validateOrder = [
  body('items').isArray().withMessage('Items must be an array'),
  body('customerName').notEmpty().trim().withMessage('Name is required'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('customerWhatsApp').notEmpty().withMessage('WhatsApp number is required'),
  body('customerAddress').notEmpty().withMessage('Address is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateInquiry = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').notEmpty().trim().withMessage('Message is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateOrder, validateInquiry };
