module.exports = (services) => {
  const express = require('express');
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({ services });
  });

  return router;
};
