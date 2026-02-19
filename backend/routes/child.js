const express = require('express');
const router = express.Router();

// Example child panel orders
let childOrders = [];

// Create child order
router.post('/order', (req, res) => {
  const { username, order } = req.body;
  if (!username || !order) return res.status(400).json({ error: 'username and order are required' });

  const newOrder = { id: childOrders.length + 1, username, order };
  childOrders.push(newOrder);
  res.json({ success: true, order: newOrder });
});

// GET all child orders
router.get('/', (req, res) => {
  res.json({ childOrders });
});

module.exports = router;
