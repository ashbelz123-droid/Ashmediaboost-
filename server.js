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

// Connect to Supabase using env variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("AshMediaBoost API Running 🚀");
});

// Admin rate update
app.post("/admin/update-rate", async (req, res) => {
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
    .eq("currency_code", currency_code);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Rate updated successfully" });
});

// Packages by country
app.get("/packages/:country", async (req, res) => {
  const country = req.params.country.toUpperCase();

  const { data: rateData, error: rateError } = await supabase
    .from("currency_rates")
    .select("*")
    .eq("currency_code", country)
    .single();

  if (rateError || !rateData)
    return res.status(400).json({ error: "Currency not found" });

  const { data: packages, error } = await supabase
    .from("packages")
    .select("*")
    .eq("country_code", country);

  if (error) return res.status(400).json({ error: error.message });

  const result = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    provider: pkg.provider,
    description: pkg.description,
    local_price: Math.ceil(pkg.price_usd * pkg.profit_multiplier * rateData.rate),
    currency: country
  }));

  res.json(result);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
