const express = require('express');
const router = express.Router();

// In-memory storage
const users = [];
const admin = { username: 'admin', password: 'ashimkagabasiraji256' };

// Signup route
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, message: 'Username and password are required' });

  // Check if user exists
  if (users.find(u => u.username === username)) return res.json({ success: false, message: 'User already exists' });

  users.push({ username, password, email: username + '@example.com' });
  res.json({ success: true, message: 'User registered', user: { username, email: username + '@example.com' } });
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, message: 'Username and password are required' });

  if (username === admin.username && password === admin.password) {
    return res.json({ success: true, message: 'Logged in as admin' });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (user) return res.json({ success: true, message: 'Logged in as user', user });
  res.json({ success: false, message: 'Invalid credentials' });
});

module.exports = router;
