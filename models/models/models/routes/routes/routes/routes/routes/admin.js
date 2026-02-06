const express = require("express");
const User = require("../models/User");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * ADMIN MIDDLEWARE
 */
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

/**
 * GET ALL USERS
 */
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET ALL ORDERS
 */
router.get("/orders", auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("service");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * UPDATE ORDER STATUS
 */
router.patch("/orders/:id", auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET ALL TRANSACTIONS
 */
router.get("/transactions", auth, adminOnly, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
