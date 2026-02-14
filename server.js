// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so you can test from frontend
app.use(cors());
app.use(express.json());

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ===============================
// Test Route: Get All Packages
// ===============================
app.get('/packages', async (req, res) => {
  try {
    const { data, error } = await supabase.from('packages').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Test Route: Get All Countries
// ===============================
app.get('/countries', async (req, res) => {
  try {
    const { data, error } = await supabase.from('countries').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
