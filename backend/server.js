require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log("Mongo Error:", err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"../public/index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>console.log("Server running on", PORT));
