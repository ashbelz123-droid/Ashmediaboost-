// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// -------------------------
// Helper Functions
// -------------------------

async function getCountries() {
  const { data, error } = await supabase.from('countries').select('*');
  if (error) console.error(error);
  return data;
}

async function getMobileMoney(country_id) {
  const { data, error } = await supabase
    .from('mobile_money')
    .select('*')
    .eq('country_id', country_id);
  if (error) console.error(error);
  return data;
}

async function getPackages() {
  const { data, error } = await supabase.from('packages').select('*, providers(*)');
  if (error) console.error(error);
  return data;
}

// -------------------------
// Wallet Top-up
// -------------------------
app.post('/wallet/topup', async (req, res) => {
  const { user_id, amount } = req.body;
  if (amount < Number(process.env.MIN_TOPUP_AMOUNT)) {
    return res.status(400).json({ error: `Minimum top-up is ${process.env.MIN_TOPUP_AMOUNT}` });
  }

  const { data: wallet, error } = await supabase
    .from('users')
    .update({ wallet_balance: supabase.rpc('sum', { x: amount }) })
    .eq('id', user_id)
    .select();
  if (error) return res.status(500).json({ error });

  await supabase.from('wallet_transactions').insert({
    user_id,
    amount,
    transaction_type: 'topup'
  });

  res.json({ message: 'Wallet topped up', wallet_balance: wallet[0].wallet_balance });
});

// -------------------------
// Create Order
// -------------------------
app.post('/orders', async (req, res) => {
  const { user_id, package_id, quantity } = req.body;

  // Fetch package price and auto-refill
  const { data: pkg, error: pkgError } = await supabase
    .from('packages')
    .select('*')
    .eq('id', package_id)
    .single();
  if (pkgError) return res.status(500).json({ error: pkgError });

  const totalPrice = pkg.price_usd * quantity * pkg.profit_multiplier;

  // Fetch user wallet
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user_id)
    .single();
  if (userError) return res.status(500).json({ error: userError });

  if (user.wallet_balance < totalPrice) {
    return res.status(400).json({ error: 'Insufficient wallet balance' });
  }

  // Deduct wallet balance
  await supabase
    .from('users')
    .update({ wallet_balance: user.wallet_balance - totalPrice })
    .eq('id', user_id);

  // Create order
  const { data: order, error: orderError } = await supabase.from('orders').insert({
    user_id,
    package_id,
    quantity,
    price_local: totalPrice,
    status: 'pending'
  }).select().single();
  if (orderError) return res.status(500).json({ error: orderError });

  // Wallet transaction log
  await supabase.from('wallet_transactions').insert({
    user_id,
    amount: totalPrice,
    transaction_type: 'order',
    related_order_id: order.id
  });

  res.json({ message: 'Order created', order });
});

// -------------------------
// Fetch Data for Frontend
// -------------------------
app.get('/data', async (req, res) => {
  const countries = await getCountries();
  const packages = await getPackages();
  res.json({ countries, packages });
});

// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
