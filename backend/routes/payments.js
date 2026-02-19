const express = require('express');
const router = express.Router();

// Dummy payments
router.post('/pay', (req, res) => {
  const { amount, username } = req.body;
  res.json({ success: true, message: `Payment of ${amount} recorded for ${username}` });
});

module.exports = router;
