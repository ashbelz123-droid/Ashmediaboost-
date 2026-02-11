const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  currency: { type: String, required: true },
  wallet: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);
