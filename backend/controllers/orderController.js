const Order = require('../models/Order');
const { sendOrderAlert } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const { items, customerName, customerEmail, coupon } = req.body;
    
    const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    // Note: Add discount logic if needed
    const total = subtotal;

    const order = new Order({
      items,
      subtotal,
      total,
      customerName,
      customerEmail,
      coupon,
      paymentStatus: 'pending',
      status: 'pending'
    });

    const createdOrder = await order.save();
    
    // Send email alert to admin
    sendOrderAlert(createdOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Check your email for details.',
      orderId: createdOrder._id
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
