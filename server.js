const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

// ===== Routes =====
app.use("/auth", require("./routes/auth"));
app.use("/wallet", require("./routes/wallet"));
app.use("/payment", require("./routes/payment"));
app.use("/order", require("./routes/order"));
app.use("/admin", require("./routes/admin"));

// ===== Home Route =====
app.get("/", (req, res) => {
  res.send("🚀 Welcome to Ashbooster!");
});

// ===== Start Server =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🔥 Ashbooster running on port ${PORT}`);
});
