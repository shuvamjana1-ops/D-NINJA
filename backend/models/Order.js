const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      folder: String,
      src: String
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  coupon: {
    type: String,
    default: null
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerWhatsApp: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  advanceAmount: Number, // 60% of total
  remainingAmount: Number, // 40% of total
  paymentMethod: {
    type: String,
    default: 'UPI / Direct Transfer'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'advance_paid', 'fully_paid', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
