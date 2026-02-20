module.exports = (users) => {
  const express = require('express');
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({ users });
  });

  return router;
};
