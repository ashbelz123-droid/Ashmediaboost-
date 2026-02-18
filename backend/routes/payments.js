const express = require('express');
const router = express.Router();

router.post('/pay', (req,res)=>{
  // Pesapal or Visa API placeholder - ready to integrate real API keys
  res.json({ success:true, message:"Payment processed (placeholder)" });
});

module.exports = router;
