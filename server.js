const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");

// Models
const User = require("./models/User");
const Order = require("./models/Order");
const Service = require("./models/Service");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log("MongoDB error:", err));

// Default currency rates (editable in admin)
let CURRENCY_RATES = {
  UGX: process.env.CURRENCY_UGX || 3600,
  KES: process.env.CURRENCY_KES || 130,
  TZS: process.env.CURRENCY_TZS || 2600,
  RWF: process.env.CURRENCY_RWF || 1460
};

// Helper to convert USD → local currency
function calculateLocalPrice(providerUSD, currency, markup=1.8){
  const rate = CURRENCY_RATES[currency] || 3600;
  return Math.round(providerUSD * markup * rate);
}

// Admin credentials
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin@123";

// ----------------------
// User Routes
// ----------------------
app.get("/", (req,res)=>res.sendFile(path.join(__dirname,"public/index.html")));

app.post("/signup", async (req,res)=>{
  const {name, country} = req.body;
  const currencyMap = {UG:"UGX", KE:"KES", TZ:"TZS", RW:"RWF"};
  const currency = currencyMap[country] || "UGX";
  try {
    const user = await User.create({name, country, currency});
    res.json({status:"success", userId:user._id, currency});
  } catch(e){ res.json({status:"error", msg:e.message}); }
});

app.post("/login", async (req,res)=>{
  const {userId} = req.body;
  const user = await User.findById(userId);
  if(!user) return res.json({status:"error", msg:"User not found"});
  res.json({status:"success", userId:user._id, currency:user.currency});
});

// Wallet deposit
app.post("/wallet/deposit", async (req,res)=>{
  const {userId, amount} = req.body;
  const user = await User.findById(userId);
  if(!user) return res.json({status:"error", msg:"User not found"});
  user.wallet += parseInt(amount);
  await user.save();
  res.json({status:"success", wallet:user.wallet});
});

// Get services by currency
app.get("/services/:currency", async (req,res)=>{
  const {currency} = req.params;
  const services = await Service.find();
  const result = services.map(s=>({
    id: s._id,
    provider: s.provider,
    platform: s.platform,
    tier: s.tier,
    price: calculateLocalPrice(s.providerUSD, currency),
    speedHours: s.speedHours,
    lifetime: s.lifetime
  }));
  res.json(result);
});

// Place order
app.post("/order", async (req,res)=>{
  const {userId, serviceId, quantity} = req.body;
  const user = await User.findById(userId);
  const service = await Service.findById(serviceId);
  if(!user || !service) return res.json({status:"error", msg:"Invalid data"});
  const price = calculateLocalPrice(service.providerUSD, user.currency) * quantity;
  if(user.wallet < price) return res.json({status:"error", msg:"Insufficient wallet"});
  user.wallet -= price;
  await user.save();
  const order = await Order.create({
    userId:user._id,
    platform: service.platform,
    provider: service.provider,
    tier: service.tier,
    quantity,
    price,
    status:"Pending",
    providerOrderId:null
  });
  res.json({status:"success", orderId:order._id});
});

// Get user orders
app.get("/orders/:userId", async (req,res)=>{
  const {userId} = req.params;
  const orders = await Order.find({userId});
  res.json(orders);
});

// ----------------------
// Admin Routes
// ----------------------
app.post("/admin/login",(req,res)=>{
  const {username,password} = req.body;
  if(username===ADMIN_USER && password===ADMIN_PASS)
    return res.json({status:"success"});
  res.json({status:"error"});
});

app.get("/admin/users", async (req,res)=>{
  const users = await User.find();
  res.json(users);
});

app.get("/admin/orders", async (req,res)=>{
  const orders = await Order.find();
  res.json(orders);
});

// Get / update currency rates
app.get("/admin/currency",(req,res)=>res.json(CURRENCY_RATES));
app.post("/admin/currency", (req,res)=>{
  const {currency, rate} = req.body;
  if(CURRENCY_RATES[currency]){
    CURRENCY_RATES[currency] = parseFloat(rate);
    return res.json({status:"success", rates:CURRENCY_RATES});
  }
  res.json({status:"error", msg:"Currency not found"});
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
