require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ===== MOCK DATA =====
let users = [
  { username: "user1", email: "user1@example.com" },
  { username: "user2", email: "user2@example.com" },
];

let orders = [];

// ===== AUTH =====
// Admin login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Change admin password as needed
  if (username === "admin" && password === "admin123") {
    return res.json({ success: true, message: "Admin login successful" });
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Signup route
app.post("/api/auth/signup", (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // In real app, save user to DB. Here we just mock
  users.push({ username, email });
  res.json({ success: true, message: "User registered successfully" });
});

// ===== USERS =====
app.get("/api/users", (req, res) => {
  res.json({ users });
});

// ===== SERVICES =====
app.get("/api/services", (req, res) => {
  res.json({
    services: [
      { platform: "Instagram", service: "Likes", price: "2.40", currency: "KE" },
      { platform: "TikTok", service: "Views", price: "1.12", currency: "KE" },
      { platform: "YouTube", service: "Subscribers", price: "4.80", currency: "KE" }
    ]
  });
});

// ===== CHILD PANEL ORDERS =====
// Create child order
app.post("/api/child/order", (req, res) => {
  const { childUsername, order } = req.body;

  if (!childUsername || !order) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const newOrder = {
    id: orders.length + 1,
    childUsername,
    order,
    status: "pending"
  };

  orders.push(newOrder);
  res.json({ success: true, order: newOrder });
});

// Get all orders
app.get("/api/child/orders", (req, res) => {
  res.json({ orders });
});

// ===== HEALTHCHECK =====
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../public/index.html")));

// ===== START SERVER =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
