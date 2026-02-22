require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));

mongoose.connect(process.env.MONGO_URI);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/orders", require("./routes/orders"));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log("Server running"));
