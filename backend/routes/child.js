const express = require('express');
const router = express.Router();

let orders = [];

// Create child order
router.post('/order', (req, res) => {
  const { username, order } = req.body;
  if (!username || !order) return res.json({ success: false, message: 'Username and order are required' });

  const newOrder = { username, order, id: orders.length + 1 };
  orders.push(newOrder);
  res.json({ success: true, message: 'Child order created', order: newOrder });
});

// Get all child orders
router.get('/', (req, res) => {
  res.json({ orders });
});

module.exports = router;
