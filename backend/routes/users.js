const express = require('express');
const router = express.Router();

// Get all users
const users = require('./auth').users || []; // reference in-memory users
router.get('/', (req, res) => {
  res.json({ users: users.map(u => ({ username: u.username, email: u.email })) });
});

module.exports = router;
