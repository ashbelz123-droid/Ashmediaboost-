module.exports = (orders) => {
  const express = require('express');
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({ orders });
  });

  router.post('/order', (req, res) => {
    const { username, order } = req.body;
    if (!username || !order)
      return res.json({ success: false, message: 'Username and order are required' });

    const newOrder = { username, order, id: orders.length + 1 };
    orders.push(newOrder);
    res.json({ success: true, message: 'Order created', order: newOrder });
  });

  return router;
};
