const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Postgres pool
const pool = new Pool({
  connectionString: process.env.DB_URL
});

// --------------------------
// Signup
// --------------------------
app.post('/signup', async (req, res) => {
  const { email, password, country_code } = req.body;

  try {
    // Check if email exists
    const exists = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (exists.rows.length > 0) return res.status(400).json({ error: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get country_id
    const countryResult = await pool.query('SELECT id FROM countries WHERE country_code=$1', [country_code]);
    if (countryResult.rows.length === 0) return res.status(400).json({ error: 'Invalid country' });
    const country_id = countryResult.rows[0].id;

    // Insert user
    await pool.query(
      'INSERT INTO users (email, password, country_id, wallet_balance) VALUES ($1, $2, $3, $4)',
      [email, hashedPassword, country_id, 0]
    );

    res.json({ success: true, message: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------
// Login
// --------------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = userResult.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ success: true, user: { id: user.id, email: user.email, wallet_balance: user.wallet_balance } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------
// Get Packages
// --------------------------
app.get('/packages', async (req, res) => {
  try {
    const packagesResult = await pool.query('SELECT * FROM packages');
    res.json(packagesResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------
// Place Order
// --------------------------
app.post('/order', async (req, res) => {
  const { user_id, package_id, quantity } = req.body;
  const FIXED_PROFIT_USD = 1.6;

  try {
    // Get package info
    const pkg = await pool.query('SELECT * FROM packages WHERE id=$1', [package_id]);
    if (pkg.rows.length === 0) return res.status(400).json({ error: 'Invalid package' });
    const packageInfo = pkg.rows[0];

    // Get user info
    const user = await pool.query('SELECT u.*, c.currency_code, r.rate FROM users u JOIN countries c ON u.country_id=c.id JOIN currency_rates r ON c.currency_code=r.currency_code WHERE u.id=$1', [user_id]);
    if (user.rows.length === 0) return res.status(400).json({ error: 'User not found' });
    const userInfo = user.rows[0];

    // Calculate total price (provider_cost + fixed profit) * exchange_rate
    const providerCostUSD = packageInfo.price_per_1000; // assume stored in USD
    const totalPriceLocal = (providerCostUSD + FIXED_PROFIT_USD) * userInfo.rate;

    // Insert order (provider hidden, auto-selection can be added)
    const provider = await pool.query('SELECT * FROM providers WHERE active=TRUE ORDER BY tier DESC LIMIT 1'); // picks highest tier active provider
    const providerId = provider.rows[0].id;

    await pool.query('INSERT INTO orders (user_id, package_id, provider_id, quantity, total_price, status) VALUES ($1,$2,$3,$4,$5,$6)',
      [user_id, package_id, providerId, quantity, totalPriceLocal, 'pending']
    );

    res.json({ success: true, total_price: totalPriceLocal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
