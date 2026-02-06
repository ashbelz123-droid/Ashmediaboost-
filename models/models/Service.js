const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      required: true // Instagram, TikTok, YouTube, etc
    },
    category: {
      type: String,
      required: true // Likes, Followers, Views
    },
    pricePer1000: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 100
    },
    max: {
      type: Number,
      default: 100000
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
