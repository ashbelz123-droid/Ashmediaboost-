const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  provider: { type: String, required: true }, // GodSMM, SocialSphare, SMMGen
  platform: { type: String, required: true }, // Instagram, TikTok, etc.
  tier: { type: String, required: true }, // Basic, Premium, VIP
  providerUSD: { type: Number, required: true }, // Price from provider in USD
  speedHours: { type: Number, required: true }, // Delivery speed in hours
  lifetime: { type: Boolean, default: false } // Lifetime package
});

module.exports = mongoose.model('Service', ServiceSchema);
