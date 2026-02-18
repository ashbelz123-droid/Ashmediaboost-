require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --------------------------
// Currency & Pricing Setup
// --------------------------
const PRICE_USD_CHILD_PANEL = parseFloat(process.env.PRICE_USD_CHILD_PANEL) || 1.5;
const PRICE_USD_API_ORDER = parseFloat(process.env.PRICE_USD_API_ORDER) || 1.2;
const PRICE_USD_USER_ORDER = parseFloat(process.env.PRICE_USD_USER_ORDER) || 15;

const currencyRates = {
  Uganda: parseFloat(process.env.RATE_UGANDA) || 3600,
  Kenya: parseFloat(process.env.RATE_KENYA) || 140,
  Tanzania: parseFloat(process.env.RATE_TANZANIA) || 2800,
  Zambia: parseFloat(process.env.RATE_ZAMBIA) || 25,
  Rwanda: parseFloat(process.env.RATE_RWANDA) || 1200,
};

// Function to get final price in local currency
function getLocalPrice(orderType, country) {
  let usdPrice = 0;
  if (orderType === 'child_panel') usdPrice = PRICE_USD_CHILD_PANEL;
  else if (orderType === 'api_order') usdPrice = PRICE_USD_API_ORDER;
  else usdPrice = PRICE_USD_USER_ORDER;

  const rate = currencyRates[country] || 1; // fallback if country not found
  return usdPrice * rate;
}

// --------------------------
// Routes
// --------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/services', require('./routes/services'));
app.use('/api/child', require('./routes/child'));
app.use('/api/payments', require('./routes/payments'));

// Example route to get local price
app.get('/api/price', (req, res) => {
  const { orderType, country } = req.query;

  if (!orderType || !country) {
    return res.status(400).json({ error: 'orderType and country are required' });
  }

  const localPrice = getLocalPrice(orderType, country);
  res.json({ orderType, country, localPrice });
});

// --------------------------
app.get('/', (req, res) => res.json({ message: 'AshMediaBoost Backend Running 🚀' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
