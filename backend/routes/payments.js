const express = require('express');
const router = express.Router();

// Dummy payments log
let payments = [];

// Create payment
router.post('/create', (req, res) => {
  const { username, amount, method } = req.body;
  if (!username || !amount || !method)
    return res.status(400).json({ success: false, message: 'All fields required' });

  const payment = { id: payments.length + 1, username, amount, method, status: 'pending' };
  payments.push(payment);
  res.json({ success: true, message: 'Payment created', payment });
});

// Get all payments
router.get('/', (req, res) => {
  res.json({ payments });
});

module.exports = router;
