require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve frontend

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET;

// -----------------------------
// Test Route
// -----------------------------
app.get("/", (req, res) => res.send("AshMediaBoost API Running 🚀"));

// -----------------------------
// Signup
// -----------------------------
app.post("/signup", async (req, res) => {
  const { email, password, country_code } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const { data: country } = await supabase
    .from("countries")
    .select("id")
    .eq("country_code", country_code)
    .single();

  if (!country) return res.status(400).json({ error: "Invalid country" });

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashed, country_id: country.id }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  const token = jwt.sign({ userId: data.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ message: "User created", token, user: data });
});

// -----------------------------
// Login
// -----------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) return res.status(400).json({ error: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ message: "Logged in", token, user });
});

// -----------------------------
// Get Packages with Dynamic Price
// -----------------------------
app.get("/packages/:currency", async (req, res) => {
  const currency = req.params.currency;

  const { data: rateData } = await supabase
    .from("currency_rates")
    .select("*")
    .eq("currency_code", currency)
    .single();

  if (!rateData) return res.status(400).json({ error: "Currency not found" });

  const { data: packages } = await supabase.from("packages").select("*");

  const result = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    platform: pkg.platform,
    local_price: Math.ceil(pkg.price_per_1000 * pkg.profit_multiplier * rateData.rate),
    min_quantity: pkg.min_quantity,
    max_quantity: pkg.max_quantity,
    currency
  }));

  res.json(result);
});

// -----------------------------
// Place Order
// -----------------------------
app.post("/order", async (req, res) => {
  const { token, package_id, quantity } = req.body;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  let decoded;
  try { decoded = jwt.verify(token, JWT_SECRET); }
  catch { return res.status(401).json({ error: "Invalid token" }); }

  const { data: pkg } = await supabase
    .from("packages")
    .select("*")
    .eq("id", package_id)
    .single();

  if (!pkg) return res.status(400).json({ error: "Package not found" });

  const { data: user } = await supabase
    .from("users")
    .select("id, country_id")
    .eq("id", decoded.userId)
    .single();

  const { data: rateData } = await supabase
    .from("countries")
    .select("currency_code")
    .eq("id", user.country_id)
    .single();

  const { data: currencyRate } = await supabase
    .from("currency_rates")
    .select("*")
    .eq("currency_code", rateData.currency_code)
    .single();

  const total_price = Math.ceil(pkg.price_per_1000 * pkg.profit_multiplier * quantity / 1000 * currencyRate.rate);

  const { data: order, error } = await supabase
    .from("orders")
    .insert([{ user_id: user.id, package_id, quantity, total_price }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Order placed", order });
});

// -----------------------------
// Admin Update Currency Rate
// -----------------------------
app.post("/admin/update-rate", async (req, res) => {
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
