const express = require("express");
const OrderItemRouter = express.Router();

// OrderItemRouter.get('/api/v1/get-order-item', (req, res)=> {

// });

OrderItemRouter.get("/api/v1/post-order-item", async (req, res) => {
  let { product, quantity } = req.body;
  const orderItem = new OrderItem({
    product: product,
    quantity: quantity,
  });
  await orderItem.save();
  res.json(orderItem);
});

OrderItemRouter.delete("/api/v1/delete-order-item/:id", (req, res) => {});

module.exports = OrderItemRouter;
