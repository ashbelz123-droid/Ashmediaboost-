const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Login placeholder' });
});

router.post('/forgot', (req, res) => {
  res.json({ message: 'Forgot user ID placeholder' });
});

module.exports = router;
