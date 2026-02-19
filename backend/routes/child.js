const express = require('express');
const router = express.Router();

// In-memory storage for child orders
let childOrders = [];

// Create a new child order
router.post('/order', (req, res) => {
  const { username, order } = req.body;
  if (!username || !order) {
    return res.status(400).json({ success: false, message: 'Username and order are required' });
  }

  const newOrder = { username, order, createdAt: new Date().toISOString() };
  childOrders.push(newOrder);

  res.json({ success: true, message: 'Child order created', order: newOrder });
});

// Get all child orders
router.get('/order', (req, res) => {
  res.json({ orders: childOrders });
});

module.exports = router;
