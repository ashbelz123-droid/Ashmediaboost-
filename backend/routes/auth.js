const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = '../data/users.json';

const admin = { username: "admin", password: "123456" }; // default admin

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if(username === admin.username && password === admin.password){
    res.json({ success: true, message: "Logged in as admin" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Forgot ID OTP placeholder
router.post('/forgot', (req,res)=>{
  res.json({ success:true, message:"OTP sent (placeholder)" });
});

module.exports = router;
