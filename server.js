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

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// ==========================
// SIGNUP
// ==========================
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, country_code } = req.body;

    if (!username || !email || !password || !country_code) {
      return res.status(400).json({ error: "All fields required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        { username, email, password: hashed, country_code }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = jwt.sign({ id: data.id }, JWT_SECRET);

    res.json({ token, user: data });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// LOGIN
// ==========================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(400).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, data.password);

    if (!valid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ id: data.id }, JWT_SECRET);

    res.json({ token, user: data });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// GET PACKAGES
// ==========================
app.get("/api/packages/:country", async (req, res) => {
  try {
    const country = req.params.country;

    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("country_code", country);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    console.error("Packages Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// UPDATE RATE (ADMIN)
// ==========================
app.post("/api/admin/update-rate", async (req, res) => {
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
      .update({ rate, updated_at: new Date() })
      .eq("currency_code", currency_code);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Rate updated successfully" });

  } catch (err) {
    console.error("Admin Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// WALLET ADD
// ==========================
app.post("/api/wallet/add", async (req, res) => {
  try {
    const { user_id, amount } = req.body;

    if (!user_id || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { error } = await supabase
      .from("wallet_transactions")
      .insert([
        { user_id, amount, type: "credit" }
      ]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Wallet Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
