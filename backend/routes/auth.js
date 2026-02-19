const express = require('express');
const router = express.Router();

// Simple admin login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Logged in as admin' });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

module.exports = router;
