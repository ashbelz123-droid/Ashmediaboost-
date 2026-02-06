const express = require("express");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * CREATE DEPOSIT (Pesapal / Mobile Money)
 */
router.post("/deposit", auth, async (req, res) => {
  try {
    const { amount, reference } = req.body;

    if (!amount || amount < 2000) {
      return res.status(400).json({ message: "Minimum deposit is 2000 UGX" });
    }

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Add to wallet
    wallet.balance += amount;
    await wallet.save();

    // Record transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      type: "deposit",
      amount,
      reference,
      status: "completed",
      method: "pesapal"
    });

    res.json({
      message: "Deposit successful",
      wallet,
      transaction
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET USER TRANSACTIONS
 */
router.get("/history", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: GET ALL TRANSACTIONS
 */
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const transactions = await Transaction.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
