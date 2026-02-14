require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// =========================
// AUTH REGISTER
// =========================
app.post("/register", async (req, res) => {
  const { username, email, password, country_code } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email, password: hashed, country_code }]);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "User registered successfully" });
});

// =========================
// LOGIN
// =========================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data)
    return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, data.password);
  if (!match)
    return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET);
  res.json({ token });
});

// =========================
// GET PACKAGES
// =========================
app.get("/packages", async (req, res) => {
  const { data, error } = await supabase
    .from("packages")
    .select("*, providers(display_name)");

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

// =========================
// ADMIN UPDATE CURRENCY
// =========================
app.post("/admin/update-rate", async (req, res) => {
  const { currency_code, rate, admin_email, admin_password } = req.body;

  if (
    admin_email !== process.env.ADMIN_EMAIL ||
    admin_password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { error } = await supabase
    .from("currency_rates")
    .update({ rate, updated_at: new Date() })
    .eq("currency_code", currency_code);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Currency updated successfully" });
});

app.listen(process.env.PORT, () => {
  console.log("Server running...");
});
