const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// -----------------------------
// MongoDB connection
// -----------------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// -----------------------------
// Import models
// -----------------------------
const User = require("./models/User");
const Order = require("./models/Order");

// -----------------------------
// Import mock providers
// -----------------------------
const godsmm = require("./providers/godsmm");
const socialsphare = require("./providers/socialsphare");
const smmgen = require("./providers/smmgen");

// -----------------------------
// User signup/login (basic safe)
// -----------------------------
app.post("/signup", async (req, res) => {
  const { name, email, password, country } = req.body;
  const user = new User({ name, email, password, country, wallet: 0, currency: "USD" });
  await user.save();
  res.json({ status: "success", userId: user._id });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.json({ status: "error", msg: "Invalid credentials" });
  res.json({ status: "success", userId: user._id, name: user.name, wallet: user.wallet });
});

// -----------------------------
// Fetch all services from mocks
// -----------------------------
app.get("/services", async (req, res) => {
  try {
    const [godServices, socialServices, smmgenServices] = await Promise.all([
      godsmm.getServices(),
      socialsphare.getServices(),
      smmgen.getServices()
    ]);

    const allServices = [...godServices, ...socialServices, ...smmgenServices];
    res.json(allServices);
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Cannot fetch services" });
  }
});

// -----------------------------
// Place an order
// -----------------------------
app.post("/order", async (req, res) => {
  const { userId, serviceId, provider, quantity } = req.body;

  let orderResult;
  try {
    if (provider === "GodSMM") orderResult = await godsmm.createOrder({ serviceId, quantity, userId });
    else if (provider === "SocialShare") orderResult = await socialsphare.createOrder({ serviceId, quantity, userId });
    else if (provider === "SMMGen") orderResult = await smmgen.createOrder({ serviceId, quantity, userId });
    else return res.json({ status: "error", msg: "Invalid provider" });

    // Save order in MongoDB
    const order = new Order({
      userId,
      serviceId,
      provider,
      quantity,
      price: 0, // can calculate later
      status: "pending",
      providerOrderId: orderResult.id
    });
    await order.save();

    res.json({ status: "success", orderId: order._id });
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Order failed" });
  }
});

// -----------------------------
// Admin endpoints (safe mocks)
// -----------------------------
app.get("/admin/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/admin/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// -----------------------------
// Start server
// -----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
