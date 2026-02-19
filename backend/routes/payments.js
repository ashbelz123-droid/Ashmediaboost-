const express = require('express');
const router = express.Router();

// Example payments/orders
let orders = [];

// Create order/payment
router.post('/create', (req, res) => {
  const { username, service, amount } = req.body;
  if (!username || !service || !amount) return res.status(400).json({ error: 'All fields required' });

  const newOrder = { id: orders.length + 1, username, service, amount };
  orders.push(newOrder);
  res.json({ success: true, order: newOrder });
});

// GET all orders/payments
router.get('/', (req, res) => {
  res.json({ orders });
});

module.exports = router;
