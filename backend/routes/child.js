const express = require('express');
const router = express.Router();

// Dummy child orders storage
let childOrders = [];

// Create child order
router.post('/order', (req, res) => {
  const { childUsername, order } = req.body;
  if (!childUsername || !order)
    return res.status(400).json({ success: false, message: 'childUsername and order required' });

  const newOrder = { id: childOrders.length + 1, childUsername, order, status: 'pending' };
  childOrders.push(newOrder);
  res.json({ success: true, message: 'Child order created', order: newOrder });
});

// Get all child orders
router.get('/orders', (req, res) => {
  res.json({ orders: childOrders });
});

module.exports = router;
