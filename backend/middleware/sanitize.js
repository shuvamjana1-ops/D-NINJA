const mongoSanitize = require('express-mongo-sanitize');

/**
 * Sanitizes request body, params, and query to strip out any keys
 * that start with '$' or contain '.', preventing MongoDB operator injection.
 *
 * Example attack it blocks:
 *   { "customerEmail": { "$gt": "" } }
 */
const sanitizeInputs = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  [Sanitizer] Blocked injection attempt on key: "${key}" from ${req.ip}`);
  },
});

module.exports = { sanitizeInputs };
