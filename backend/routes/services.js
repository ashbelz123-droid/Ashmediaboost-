const express = require('express');
const router = express.Router();

// Pesapal-supported mobile money countries
const exchangeRates = {
  KE: 160, UG: 4100, TZ: 2350, RW: 1100, ZM: 20, ZW: 750, MW: 1050
};

// Services with base price + your profit in USD
const servicesUSD = [
  { platform: 'Instagram', service: 'Likes', basePrice: 0.01, profit: 0.005 },
  { platform: 'TikTok', service: 'Views', basePrice: 0.005, profit: 0.002 },
  { platform: 'YouTube', service: 'Subscribers', basePrice: 0.02, profit: 0.01 }
];

router.get('/', (req,res)=>{
  const country = req.query.country?.toUpperCase() || 'KE';
  const rate = exchangeRates[country] ?? exchangeRates['KE'];

  const pricedServices = servicesUSD.map(s => ({
    platform: s.platform,
    service: s.service,
    price: ((s.basePrice + s.profit) * rate).toFixed(2),
    currency: country
  }));

  res.json({ services: pricedServices });
});

module.exports = router;
