const router = require("express").Router();
const axios = require("axios");

router.post("/initiate",async(req,res)=>{
 try{

 const response = await axios.post(
 `${process.env.PESAPAL_BASE_URL}/Transactions/SubmitOrderRequest`,
 req.body,
 {
 headers:{
 Authorization:`Bearer ${process.env.PESAPAL_TOKEN}`
 }
 });

 res.json(response.data);

 }catch(err){
 res.json({success:false});
 }
});

module.exports = router;
