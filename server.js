require("dotenv").config();
const express = require("express");
const cors = require("cors");
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
// TEST ROUTE
// -----------------------------
app.get("/", (req, res) => {
  res.send("AshMediaBoost API Running 🚀");
});

// -----------------------------
// GET PACKAGES
// -----------------------------
app.get("/packages/:currency", async (req, res) => {
  const currency = req.params.currency;

  const { data: rateData, error: rateError } = await supabase
    .from("currency_rates")
    .select("*")
    .eq("currency_code", currency)
    .single();

  if (rateError || !rateData)
    return res.status(400).json({ error: "Currency not found" });

  const { data: packages, error } = await supabase
    .from("packages")
    .select("*, providers(*)");

  if (error) return res.status(400).json({ error: error.message });

  const result = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    provider: pkg.providers.display_name,
    description: pkg.description,
    type: pkg.type || "Standard",
    local_price: Math.ceil(pkg.price_usd * pkg.profit_multiplier * rateData.rate),
    currency
  }));

  res.json(result);
});

// -----------------------------
// ADMIN UPDATE RATE
// -----------------------------
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
    .update({ rate, updated_at: new Date() })
    .eq("currency_code", currency_code);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Rate updated successfully" });
});

// -----------------------------
// WALLET
// -----------------------------
app.get("/wallet/:userId", async (req, res) => {
  const { userId } = req.params;

  const { data: wallet, error } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  const balance = wallet.reduce((acc, tx) => acc + tx.amount, 0);
  res.json({ balance, transactions: wallet });
});

app.post("/wallet/topup", async (req, res) => {
  const { userId, amount, method } = req.body;
  if (!userId || !amount) return res.status(400).json({ error: "Missing params" });

  const { data, error } = await supabase
    .from("wallet_transactions")
    .insert([{ user_id: userId, amount: Number(amount), method, created_at: new Date() }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Top-up successful", transaction: data[0] });
});

app.post("/wallet/pay", async (req, res) => {
  const { userId, packageId, qty, price } = req.body;
  if (!userId || !packageId || !qty || !price) return res.status(400).json({ error: "Missing params" });

  const { data: wallet, error: wError } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", userId);

  if (wError) return res.status(400).json({ error: wError.message });

  const balance = wallet.reduce((acc, tx) => acc + tx.amount, 0);
  if (balance < price) return res.status(400).json({ error: "Insufficient balance" });

  await supabase
    .from("wallet_transactions")
    .insert([{ user_id: userId, amount: -price, method: "wallet_payment", created_at: new Date() }]);

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert([{ user_id: userId, package_id: packageId, quantity: qty, total_price: price, status: "paid", created_at: new Date() }]);

  if (orderError) return res.status(400).json({ error: orderError.message });
  res.json({ message: "Package purchased successfully", order: orderData[0] });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
