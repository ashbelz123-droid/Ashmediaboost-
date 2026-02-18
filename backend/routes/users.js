const express = require('express');
const router = express.Router();

router.get('/wallet/:id', (req, res) => {
  res.json({ wallet: 100 });
});

router.post('/order', (req, res) => {
  res.json({ message: 'Order placed (placeholder)' });
});

module.exports = router;
