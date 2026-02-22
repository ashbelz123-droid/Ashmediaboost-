require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));

/* DATABASE */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("✅ Database Connected"))
.catch(err=>console.log(err));

/* ROUTES */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));

/* HOME */

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/index.html"));
});

/* HEALTH CHECK */

app.get("/health",(req,res)=>{
    res.send("OK");
});

/* SERVER START */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
    console.log("🚀 AshMediaBoost Running");
});
