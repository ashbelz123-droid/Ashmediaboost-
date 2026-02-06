const express = require("express");
const Wallet = require("../models/Wallet");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET WALLET BALANCE
 */
router.get("/", auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * CREDIT WALLET (ADMIN / SYSTEM)
 */
router.post("/credit", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findOneAndUpdate(
      { user: req.user.id },
      { $inc: { balance: amount } },
      { new: true }
    );

    res.json({
      message: "Wallet credited successfully",
      wallet
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DEBIT WALLET
 */
router.post("/debit", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= amount;
    await wallet.save();

    res.json({
      message: "Wallet debited successfully",
      wallet
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
