const express = require('express');
const router = express.Router();
const fs = require('fs');
const pathChild = '../data/child_panels.json';

router.get('/wallet/:id', (req,res)=>{
  let childs = [];
  try{ childs = JSON.parse(fs.readFileSync(pathChild,'utf8')); }
  catch(err){ childs = []; }

  const panel = childs.find(c => c.id === req.params.id);
  if(panel) res.json({ wallet: panel.wallet });
  else res.status(404).json({ message:"Child panel not found" });
});

module.exports = router;
