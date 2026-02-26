require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB Connected"));

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"../public/index.html"));
});

app.use("/api/callback",require("./routes/callback"));

const PORT = process.env.PORT || 10000;
app.listen(PORT);
