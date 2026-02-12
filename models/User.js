const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  country: String,
  wallet: { type: Number, default: 0 },
  currency: { type: String, default: "USD" }
});

module.exports = mongoose.model("User", userSchema);
