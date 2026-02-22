const router = require("express").Router();
const Order = require("../models/Order");

router.post("/create", async (req,res)=>{
    const {userId, box, price} = req.body;

    const order = await Order.create({
        userId,
        box,
        price
    });

    res.json({success:true, order});
});

router.get("/my/:userId", async (req,res)=>{
    const orders = await Order.find({userId:req.params.userId});
    res.json({orders});
});

module.exports = router;
