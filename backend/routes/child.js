const express = require('express');
const router = express.Router();

// Dummy child orders
let childOrders = [];

router.post('/order', (req, res) => {
  const { username, order } = req.body;
  const newOrder = { username, order };
  childOrders.push(newOrder);
  res.json({ success: true, message: 'Child order created', order: newOrder });
});

module.exports = router;
