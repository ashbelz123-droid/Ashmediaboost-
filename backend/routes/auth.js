const express = require('express');
const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Logged in as admin' });
  }
  res.json({ success: false, message: 'Invalid credentials' });
});

// Signup (dummy)
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  res.json({ success: true, message: `User ${username} created` });
});

module.exports = router;
