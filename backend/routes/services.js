const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    services: [
      { platform: 'Instagram', service: 'Likes', price: 0.01 },
      { platform: 'TikTok', service: 'Views', price: 0.005 },
      { platform: 'YouTube', service: 'Subscribers', price: 0.02 }
    ]
  });
});

module.exports = router;
