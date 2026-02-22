const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
 userId:String,
 box:String,
 status:{type:String,default:"Pending"},
 price:Number,
 createdAt:{type:Date,default:Date.now}
});

module.exports = mongoose.model("Order",OrderSchema);
