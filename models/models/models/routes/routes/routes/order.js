const express = require("express");
const Order = require("../models/Order");
const Service = require("../models/Service");
const Wallet = require("../models/Wallet");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * CREATE ORDER
 */
router.post("/", auth, async (req, res) => {
  try {
    const { serviceId, quantity, link } = req.body;

    if (!serviceId || !quantity || !link) {
      return res.status(400).json({ message: "All fields required" });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // Calculate price dynamically
    const price = (quantity / 1000) * service.pricePer1000;

    // Check if wallet has enough balance
    if (wallet.balance < price) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct wallet
    wallet.balance -= price;
    await wallet.save();

    // Create order
    const order = await Order.create({
      user: req.user.id,
      service: serviceId,
      quantity,
      price,
      link
    });

    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET USER ORDERS
 */
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("service");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
