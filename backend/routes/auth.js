const express = require('express');
const router = express.Router();

// Dummy users for testing
let users = [
  { username: 'admin', password: process.env.ADMIN_PASSWORD, email: 'admin@ashmediaboost.com' },
  { username: 'user1', password: 'user1pass', email: 'user1@example.com' },
];

// Signup route
router.post('/signup', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ success: false, message: 'All fields required' });

  if (users.find(u => u.username === username))
    return res.status(400).json({ success: false, message: 'Username exists' });

  users.push({ username, password, email });
  res.json({ success: true, message: 'User registered', user: { username, email } });
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  res.json({ success: true, message: username === 'admin' ? 'Logged in as admin' : 'Logged in', user: { username, email: user.email } });
});

module.exports = router;
