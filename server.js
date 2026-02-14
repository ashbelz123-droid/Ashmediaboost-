// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---------------------------
// Supabase Connection
// ---------------------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ---------------------------
// Helper: Convert Min Top-up
// ---------------------------
const MIN_TOPUP_UGX = 500; // minimum in UGX

async function convertToLocal(amountUGX, currency_code) {
  const { data, error } = await supabase
    .from('currency_rates')
    .select('rate_to_usd')
    .eq('currency_code', currency_code)
    .single();

  if (error) throw error;

  // convert UGX to local currency
  const rateUSD = data.rate_to_usd;
  return amountUGX * rateUSD / 0.00027; // using UGX rate as reference
}

// ---------------------------
// ROUTE: Top-up Wallet (Pesapal Placeholder)
// ---------------------------
app.post('/wallet/topup', async (req, res) => {
  try {
    const { user_id, amount_ugx } = req.body;

    if (amount_ugx < MIN_TOPUP_UGX) {
      return res.status(400).json({ error: `Minimum top-up is ${MIN_TOPUP_UGX} UGX` });
    }

    // Record top-up in wallet (Pesapal payment placeholder)
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert([{
        user_id,
        amount: amount_ugx,
        transaction_type: 'topup',
      }]);

    if (error) throw error;

    // Update user wallet balance
    const { error: updateErr } = await supabase
      .from('users')
      .update({
        wallet_balance: supabase.raw('wallet_balance + ?', [amount_ugx])
      })
      .eq('id', user_id);

    if (updateErr) throw updateErr;

    res.json({ message: 'Wallet topped up successfully', transaction: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// ROUTE: Create Order
// ---------------------------
app.post('/orders', async (req, res) => {
  try {
    const { user_id, package_id, quantity } = req.body;

    // Get user & package
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();
    if (userErr) throw userErr;

    const { data: pkg, error: pkgErr } = await supabase
      .from('packages')
      .select('*')
      .eq('id', package_id)
      .single();
    if (pkgErr) throw pkgErr;

    const totalPrice = pkg.price_usd * pkg.profit_multiplier * quantity;

    if (user.wallet_balance < totalPrice) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Deduct wallet
    const { error: deductErr } = await supabase
      .from('users')
      .update({ wallet_balance: user.wallet_balance - totalPrice })
      .eq('id', user_id);
    if (deductErr) throw deductErr;

    // Create order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert([{
        user_id,
        package_id,
        quantity,
        price_local: totalPrice,
        status: 'pending'
      }])
      .select()
      .single();
    if (orderErr) throw orderErr;

    // Auto-refill logic placeholder
    if (pkg.auto_refill) {
      console.log(`Order ${order.id} is auto-refill enabled`);
      // Add your auto-refill scheduling here
    }

    res.json({ message: 'Order created', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// ROUTE: Refund Wallet (Failed Order)
// ---------------------------
app.post('/orders/refund', async (req, res) => {
  try {
    const { order_id } = req.body;

    // Get order info
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();
    if (orderErr) throw orderErr;

    if (order.status !== 'failed') {
      return res.status(400).json({ error: 'Order is not failed' });
    }

    // Refund wallet
    const { error: refundErr } = await supabase
      .from('users')
      .update({ wallet_balance: supabase.raw('wallet_balance + ?', [order.price_local]) })
      .eq('id', order.user_id);
    if (refundErr) throw refundErr;

    // Add wallet transaction
    const { error: txnErr } = await supabase
      .from('wallet_transactions')
      .insert([{
        user_id: order.user_id,
        amount: order.price_local,
        transaction_type: 'refund',
        related_order_id: order_id
      }]);
    if (txnErr) throw txnErr;

    res.json({ message: 'Wallet refunded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// ROUTE: Test Fetch Packages
// ---------------------------
app.get('/packages', async (req, res) => {
  try {
    const { data, error } = await supabase.from('packages').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// ROUTE: Test Fetch Countries
// ---------------------------
app.get('/countries', async (req, res) => {
  try {
    const { data, error } = await supabase.from('countries').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// Start Server
// ---------------------------
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
