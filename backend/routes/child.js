const express = require('express');
const router = express.Router();

router.get('/wallet/:id', (req, res) => {
  res.json({ wallet: 50 });
});

module.exports = router;
