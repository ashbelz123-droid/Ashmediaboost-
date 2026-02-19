const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// ===== MOCK DATA =====
let users = [
  { username: "user1", email: "user1@example.com" },
  { username: "user2", email: "user2@example.com" },
];

let orders = [];

// ===== AUTH =====
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    return res.json({ success: true, message: "Admin login successful" });
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
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
      { platform: "TikTok", service: "Views", price: "1.12", currency: "KE" }
    ]
  });
});

// ===== CHILD ORDER =====
app.post("/api/child/order", (req, res) => {
  const { childUsername, order } = req.body;

  const newOrder = {
    id: orders.length + 1,
    childUsername,
    order,
    status: "pending"
  };

  orders.push(newOrder);

  res.json({ success: true, order: newOrder });
});

// ===== GET ORDERS =====
app.get("/api/child/orders", (req, res) => {
  res.json({ orders });
});

// Root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
