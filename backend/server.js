require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Currency rates
const currencyRates = {
  Uganda: parseFloat(process.env.RATE_UGANDA),
  Kenya: parseFloat(process.env.RATE_KENYA),
  Tanzania: parseFloat(process.env.RATE_TANZANIA),
  Zambia: parseFloat(process.env.RATE_ZAMBIA),
  Rwanda: parseFloat(process.env.RATE_RWANDA),
};

// Profit multipliers by user type
const profitUserType = {
  child_panel: parseFloat(process.env.PROFIT_CHILD_PANEL),
  api_order: parseFloat(process.env.PROFIT_API_ORDER),
  user_order: parseFloat(process.env.PROFIT_USER_ORDER),
};

// Base USD prices
const baseUSDPrice = {
  child_panel: parseFloat(process.env.PRICE_USD_CHILD_PANEL),
  api_order: parseFloat(process.env.PRICE_USD_API_ORDER),
  user_order: parseFloat(process.env.PRICE_USD_USER_ORDER),
};

// SMM Providers
const providers = {
  SocialSphere: process.env.SOCIALSPHERE_KEY,
  SMMGen: process.env.SMMGEN_KEY,
  GodSMM: process.env.GODSMM_KEY,
};

// Final price calculation
function getFinalPrice(orderType, country) {
  const usdPrice = baseUSDPrice[orderType] || 1;
  const profitMultiplier = profitUserType[orderType] || 1;
  const rate = currencyRates[country] || 1;
  return usdPrice * profitMultiplier * rate;
}

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/users', require('../routes/users'));
app.use('/api/services', require('../routes/services'));
app.use('/api/child', require('../routes/child'));
app.use('/api/payments', require('../routes/payments'));

// Test price route
app.get('/api/price', (req, res) => {
  const { orderType, country, provider } = req.query;
  if (!orderType || !country || !provider)
    return res.status(400).json({ error: 'orderType, country, and provider required' });
  if (!providers[provider])
    return res.status(400).json({ error: 'Invalid provider' });

  const finalPrice = getFinalPrice(orderType, country);
  res.json({ orderType, country, provider, finalPrice });
});

// Healthcheck
app.get('/', (req, res) => res.json({ message: 'AshMediaBoost Backend Running 🚀' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
