const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  const { service, quantity } = req.body;

  const order = await Order.create({
    userId: req.user.id,
    service,
    quantity
  });

  res.json({ message: "Order created", order });
});

router.get("/my", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

module.exports = router;
