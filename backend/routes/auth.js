const express = require('express');
const router = express.Router();

// In-memory storage
let users = []; // stores normal users
const admin = { username: 'admin', password: 'ashimkagabasiraji256' };

// Signup route for normal users
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  // Check if user already exists
  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }

  users.push({ username, password });
  res.json({ success: true, message: 'User signed up', user: { username } });
});

// Login route (both admin and normal users)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  // Admin login
  if (username === admin.username && password === admin.password) {
    return res.json({ success: true, message: 'Logged in as admin' });
  }

  // Normal user login
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({ success: true, message: 'Logged in as user', user: { username: user.username } });
});

// Get all users (admin only)
router.get('/', (req, res) => {
  // Only return usernames and emails (no passwords)
  const userList = users.map(u => ({ username: u.username, email: `${u.username}@example.com` }));
  res.json({ users: userList });
});

module.exports = router;
