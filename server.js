const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/wallet", require("./routes/wallet"));
app.use("/payment", require("./routes/payment"));
app.use("/order", require("./routes/order"));
app.use("/admin", require("./routes/admin"));

// Home page
app.get("/", (req, res) => {
  res.send(`<h1>🚀 Welcome to ${process.env.SITE_NAME || "Ashbooster"}!</h1>`);
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🔥 Ashbooster running on port ${PORT}`);
});
