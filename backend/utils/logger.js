const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Ensure the logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream (in append mode) for access.log
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

/**
 * Console logger: colourful dev output
 */
const consoleLogger = morgan('dev');

/**
 * File logger: combined format → logs/access.log
 */
const fileLogger = morgan('combined', { stream: accessLogStream });

module.exports = { consoleLogger, fileLogger };
