/**
 * D'NINJA — Admin Auth Middleware
 *
 * Protects admin-only endpoints (e.g., GET /api/orders, GET /api/contact).
 * Clients must send:  Authorization: Bearer <ADMIN_SECRET>
 *
 * Set ADMIN_SECRET in your .env file.
 */
const adminAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    console.error('❌ ADMIN_SECRET is not set in environment variables.');
    return res.status(500).json({
      success: false,
      message: 'Server configuration error.',
    });
  }

  if (token !== secret) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Invalid admin token.',
    });
  }

  next();
};

module.exports = { adminAuth };
