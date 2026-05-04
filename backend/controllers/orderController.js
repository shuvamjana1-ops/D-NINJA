const Order = require('../models/Order');
const { sendOrderAlert } = require('../utils/emailService');

// Coupon Dictionary to match frontend
const COUPONS = {
  'NINJA20': 0.20,
  'STUDENT30': 0.30,
  'FIRSTORDER': 0.15
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const { items, customerName, customerEmail, customerWhatsApp, customerAddress, coupon } = req.body;
    
    // Calculate financial details
    const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    
    let discount = 0;
    if (coupon && COUPONS[coupon.toUpperCase()]) {
      discount = Math.round(subtotal * COUPONS[coupon.toUpperCase()]);
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
      coupon,
      paymentStatus: 'pending',
      status: 'pending'
    });

    const createdOrder = await order.save();
    
    // Await email alert to ensure delivery before responding (or catch error)
    await sendOrderAlert(createdOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Check your email for details.',
      orderId: createdOrder._id,
      advanceAmount: createdOrder.advanceAmount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (for admin)
// @route   GET /api/orders
// @access  Private (Placeholder for now)
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort('-createdAt');
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders };
