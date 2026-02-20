module.exports = (adminCredentials) => {
  const express = require('express');
  const router = express.Router();

  // Admin login
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res.json({ success: false, message: 'Username and password are required' });

    if (username === adminCredentials.username && password === adminCredentials.password) {
      return res.json({ success: true, message: 'Logged in as admin' });
    }
    return res.json({ success: false, message: 'Invalid credentials' });
  });

  return router;
};
