const router = require("express").Router();
const User = require("../models/User");

router.post("/signup",async(req,res)=>{
 const user = new User(req.body);
 await user.save();
 res.json({success:true,message:"Account created"});
});

router.post("/login",async(req,res)=>{
 const user = await User.findOne(req.body);
 if(!user) return res.json({success:false});
 res.json({success:true,user});
});

module.exports = router;
