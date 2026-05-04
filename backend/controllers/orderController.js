const Order = require('../models/Order');
const { sendOrderAlert, sendOrderConfirmation } = require('../utils/emailService');

// Coupon dictionary — must stay in sync with frontend cart.js
const COUPONS = {
  'NINJA20':    0.20,
  'STUDENT30':  0.30,
  'FIRSTORDER': 0.15,
};

// ─────────────────────────────────────────────
// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
// ─────────────────────────────────────────────
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      customerName,
      customerEmail,
      customerWhatsApp,
      customerAddress,
      coupon,
    } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('Order must contain at least one item.');
    }

    // Calculate financials server-side (never trust client totals)
    const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    let discount = 0;
    let appliedCoupon = null;
    if (coupon && COUPONS[coupon.toUpperCase()]) {
      appliedCoupon = coupon.toUpperCase();
      discount = Math.round(subtotal * COUPONS[appliedCoupon]);
    }

    const total = subtotal - discount;
    const advanceAmount = Math.round(total * 0.60);
    const remainingAmount = total - advanceAmount;

    const order = new Order({
      items,
      customerName,
      customerEmail,
      customerWhatsApp,
      customerAddress,
      subtotal,
      discount,
      total,
      advanceAmount,
      remainingAmount,
      coupon: appliedCoupon,
      paymentStatus: 'pending',
      status: 'pending',
    });

    const createdOrder = await order.save();

    // Send emails in parallel — don't block response if one fails
    await Promise.allSettled([
      sendOrderAlert(createdOrder),
      sendOrderConfirmation(createdOrder),
    ]);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully! Check your email for confirmation.",
      orderId: createdOrder._id,
      advanceAmount: createdOrder.advanceAmount,
      total: createdOrder.total,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
// ─────────────────────────────────────────────
const getOrders = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({}).sort('-createdAt').skip(skip).limit(limit),
      Order.countDocuments(),
    ]);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      count: orders.length,
      total,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private (Admin)
// ─────────────────────────────────────────────
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found.');
    }
    res.json({ success: true, order });
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.name === 'CastError') {
      res.status(400);
      return next(new Error('Invalid order ID format.'));
    }
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin)
// ─────────────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found.');
    }

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    const validPaymentStatuses = ['pending', 'advance_paid', 'fully_paid', 'failed'];

    if (status && !validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      res.status(400);
      throw new Error(`Invalid paymentStatus. Must be one of: ${validPaymentStatuses.join(', ')}`);
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updated = await order.save();
    res.json({ success: true, message: 'Order updated.', order: updated });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400);
      return next(new Error('Invalid order ID format.'));
    }
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
