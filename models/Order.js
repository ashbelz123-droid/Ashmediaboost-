const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  serviceId: String,
  provider: String,
  quantity: Number,
  price: Number,
  status: { type: String, default: "pending" },
  providerOrderId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
