const express = require('express');
const router = express.Router();

// Dummy services
const services = [
  { platform: 'Instagram', service: 'Likes', price: '2.40', currency: 'KE' },
  { platform: 'TikTok', service: 'Views', price: '1.12', currency: 'KE' },
  { platform: 'YouTube', service: 'Subscribers', price: '4.80', currency: 'KE' },
];

router.get('/', (req, res) => {
  res.json({ services });
});

module.exports = router;
