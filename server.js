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

// -----------------------------
// SUPABASE CLIENT
// -----------------------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -----------------------------
// TEST ROUTE
// -----------------------------
app.get("/", (req, res) => {
  res.send("AshMediaBoost API Running 🚀");
});

// -----------------------------
// GET PACKAGES WITH LOCAL PRICE
// -----------------------------
app.get("/packages/:currency", async (req, res) => {
  try {
    const currency = req.params.currency.toUpperCase();

    // Get currency rate
    const { data: rateData, error: rateError } = await supabase
      .from("currency_rates")
      .select("*")
      .eq("currency_code", currency)
      .single();

    if (rateError || !rateData)
      return res.status(400).json({ error: "Currency not found" });

    // Get all packages with provider info
    const { data: packages, error: pkgError } = await supabase
      .from("packages")
      .select("*, providers(display_name)");

    if (pkgError) return res.status(400).json({ error: pkgError.message });

    const result = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      provider: pkg.providers.display_name,
      description: pkg.description,
      local_price: Math.ceil(pkg.price_usd * pkg.profit_multiplier * rateData.rate),
      currency: currency
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// ADMIN UPDATE CURRENCY RATE
// -----------------------------
app.post("/admin/update-rate", async (req, res) => {
  try {
    const { currency_code, rate, email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { error } = await supabase
      .from("currency_rates")
      .update({ rate: rate, updated_at: new Date() })
      .eq("currency_code", currency_code.toUpperCase());

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Rate updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
// PORT LISTENER
// -----------------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AshMediaBoost API running on port ${PORT}`);
});
