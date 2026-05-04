const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

const { validateOrder } = require('../middleware/validation');
const { adminAuth }      = require('../middleware/auth');
const { orderLimiter }   = require('../middleware/rateLimiter');

// Public — place a new order (rate limited + validated)
router.post('/', orderLimiter, validateOrder, createOrder);

// Admin — list all orders (paginated)
router.get('/', adminAuth, getOrders);

// Admin — get single order
router.get('/:id', adminAuth, getOrderById);

// Admin — update order/payment status
router.patch('/:id/status', adminAuth, updateOrderStatus);

module.exports = router;
