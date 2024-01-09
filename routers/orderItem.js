const express = require("express");
const OrderItemRouter = express.Router();

// OrderItemRouter.get('/api/v1/get-order-item', (req, res)=> {

// });

OrderItemRouter.get("/api/v1/order/create", async (req, res) => {
  let { product, quantity } = req.body;
  const orderItem = new OrderItem({
    product: product,
    quantity: quantity,
  });
  await orderItem.save();
  res.json(orderItem);
});

OrderItemRouter.delete("/api/v1/order/deleteById/:id", async (req, res) => {
  const getOrder = await Order;
});

module.exports = OrderItemRouter;
