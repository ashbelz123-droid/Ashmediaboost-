const express = require('express');
const router = express.Router();

// In-memory services list
const services = [
  { platform: "Instagram", service: "Likes", price: "2.40", currency: "KE" },
  { platform: "TikTok", service: "Views", price: "1.12", currency: "KE" },
  { platform: "YouTube", service: "Subscribers", price: "4.80", currency: "KE" },
  { platform: "Facebook", service: "Likes", price: "1.50", currency: "KE" },
  { platform: "Twitter", service: "Followers", price: "3.00", currency: "KE" }
];

// Get all services
router.get('/', (req, res) => {
  res.json({ services });
});

module.exports = router;
