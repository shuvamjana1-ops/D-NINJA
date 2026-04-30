const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');
const { validateOrder } = require('../middleware/validation');

router.post('/', validateOrder, createOrder);
router.get('/', getOrders); // Note: Should be protected in production

module.exports = router;
