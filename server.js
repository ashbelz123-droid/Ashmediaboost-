require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -----------------------------
// Auth Routes
// -----------------------------
app.post("/api/signup", async (req, res) => {
  const { username, email, password, country_code } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email, password: hashed, country_code }]);

  if (error) return res.status(400).json({ error: error.message });

  const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET);
  res.json({ token, user: data[0] });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, data.password);
  if (!valid) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET);
  res.json({ token, user: data });
});

// -----------------------------
// Packages API
// -----------------------------
app.get("/api/packages/:country", async (req, res) => {
  const country = req.params.country;
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("country_code", country);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// -----------------------------
// Admin: Update Currency Rates
// -----------------------------
app.post("/api/admin/update-rate", async (req, res) => {
  const { currency_code, rate, email, password } = req.body;
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: "Unauthorized" });

  const { error } = await supabase
    .from("currency_rates")
    .update({ rate, updated_at: new Date() })
    .eq("currency_code", currency_code);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Rate updated successfully" });
});

// -----------------------------
// Wallet Credit
// -----------------------------
app.post("/api/wallet/add", async (req, res) => {
  const { user_id, amount } = req.body;
  const { data, error } = await supabase
    .from("wallet_transactions")
    .insert([{ user_id, amount, type: "credit" }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, data });
});

// -----------------------------
// Server Start
// -----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
