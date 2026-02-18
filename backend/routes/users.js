const express = require('express');
const router = express.Router();
const fs = require('fs');
const pathOrders = '../data/orders.json';
const { readUsers, writeUsers, updateWallet } = require('../utils/wallet');

router.get('/wallet/:id', (req,res)=>{
  const users = readUsers();
  const user = users.find(u=>u.id===req.params.id);
  if(user) res.json({ wallet: user.wallet });
  else res.status(404).json({ message:"User not found" });
});

router.post('/order', (req,res)=>{
  const { userId, service, quantity, price } = req.body;

  if(!updateWallet(userId,-price)) return res.status(400).json({ message:"Insufficient wallet or user not found" });

  let orders = [];
  try{ orders = JSON.parse(fs.readFileSync(pathOrders,'utf8')); }
  catch(err){ orders = []; }

  orders.push({ id: Date.now(), userId, service, quantity, price, status:"pending" });
  fs.writeFileSync(pathOrders, JSON.stringify(orders,null,2));

  res.json({ success:true, message:"Order placed" });
});

module.exports = router;
