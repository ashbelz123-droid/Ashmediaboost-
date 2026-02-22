const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: String,
    box: String,
    price: Number,
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
