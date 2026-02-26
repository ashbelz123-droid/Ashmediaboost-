const router = require("express").Router();

router.post("/",async(req,res)=>{

console.log("Payment callback received");

res.status(200).send("OK");

});

module.exports = router;
