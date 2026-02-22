const mongoose = require("mongoose");

const ProviderSchema = new mongoose.Schema({
    name:String,
    apiKey:String,
    status:{type:String,default:"hidden"}
});

module.exports = mongoose.model("Provider",ProviderSchema);
