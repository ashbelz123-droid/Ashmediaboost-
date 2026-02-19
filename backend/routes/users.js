const express = require('express');
const router = express.Router();

// Dummy users list
let users = [
  { username: 'user1', email: 'user1@example.com' },
  { username: 'user2', email: 'user2@example.com' },
  { username: 'user3', email: 'user3@example.com' },
];

// Get all users
router.get('/', (req, res) => {
  res.json({ users });
});

module.exports = router;
