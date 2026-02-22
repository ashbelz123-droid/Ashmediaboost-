const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId:String,
    package:String,
    price:Number,
    status:{type:String,default:"Pending"},
    createdAt:{type:Date,default:Date.now}
});

module.exports = mongoose.model("Order",OrderSchema);
