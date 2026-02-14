require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Import models
const User = require('./models/user');
const Provider = require('./models/provider');
const Package = require('./models/package');
const Order = require('./models/order');
const Wallet = require('./models/wallet');
const Currency = require('./models/currency');

// -------------------------
// Frontend
// -------------------------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public/admin.html')));

// -------------------------
// Wallet Top-up
// -------------------------
app.post('/wallet/topup', async (req, res) => {
  const { user_id, amount } = req.body;
  if (amount < Number(process.env.MIN_TOPUP_AMOUNT))
    return res.status(400).json({ error: `Minimum top-up is ${process.env.MIN_TOPUP_AMOUNT}` });

  const { data: wallet, error } = await User.updateWallet(user_id, amount);
  if (error) return res.status(500).json({ error });

  await Wallet.addTransaction({ user_id, amount, transaction_type: 'topup' });
  res.json({ message: 'Wallet topped up', wallet_balance: wallet[0].wallet_balance });
});

// -------------------------
// Create Order
// -------------------------
app.post('/orders', async (req, res) => {
  const { user_id, package_id, quantity } = req.body;
  try {
    const pkg = await Package.findById(package_id);
    const user = await User.findById(user_id);

    const exchange = await Currency.getRate(pkg.price_usd_currency || 'USD'); // dynamic
    const totalPriceLocal = pkg.price_usd * pkg.profit_multiplier * exchange.rate * quantity;

    if (user.wallet_balance < totalPriceLocal)
      return res.status(400).json({ error: 'Insufficient wallet balance' });

    await User.updateWallet(user_id, user.wallet_balance - totalPriceLocal);
    const order = await Order.create({ user_id, package_id, quantity, price_local: totalPriceLocal, status: 'pending' });
    await Wallet.addTransaction({ user_id, amount: totalPriceLocal, transaction_type: 'order', related_order_id: order.id });

    res.json({ message: 'Order created', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order failed' });
  }
});

// -------------------------
// Admin Update Currency
// -------------------------
app.post('/admin/currency', async (req, res) => {
  const { currency_code, rate } = req.body;
  try {
    await Currency.updateRate(currency_code, rate);
    res.json({ message: 'Currency rate updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update rate' });
  }
});

// -------------------------
// Data for Frontend
// -------------------------
app.get('/data', async (req, res) => {
  const countries = await supabase.from('countries').select('*');
  const packages = await Package.all();
  res.json({ countries: countries.data, packages: packages.data });
});

// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
