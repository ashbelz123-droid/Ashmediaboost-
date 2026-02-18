const express = require('express');
const router = express.Router();

router.post('/pay', (req, res) => {
  res.json({ message: 'Payment placeholder' });
});

module.exports = router;
