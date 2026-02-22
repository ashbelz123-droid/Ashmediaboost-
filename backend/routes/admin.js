const router = require("express").Router();
const Order = require("../models/Order");

router.get("/orders", async (req,res)=>{
    const orders = await Order.find();
    res.json({orders});
});

router.post("/approve/:id", async (req,res)=>{
    await Order.findByIdAndUpdate(req.params.id,{
        status:"Completed"
    });
    res.json({success:true});
});

module.exports = router;
