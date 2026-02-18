const express = require('express');
const router = express.Router();

const admin = { username: "admin", password: "ashimkagabasiraji256" };

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if(username === admin.username && password === admin.password){
    res.json({ success: true, message: "Logged in as admin" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

router.post('/forgot', (req,res)=>{
  res.json({ success:true, message:"OTP sent to user (placeholder)" });
});

module.exports = router;
