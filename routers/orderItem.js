const express = require("express");
const userAuth = require("../middlewares/auth");
const OrderItemRouter = express.Router();
const OrderItem = require('../models/order_item');
const handleValidationError = require("../middlewares/error_handler");

// OrderItemRouter.get('/api/v1/get-order-item', (req, res)=> {

// });

OrderItemRouter.post("/api/v1/order-item/create",  async (req, res) => {
  let { product, quantity } = req.body;
 try {
  const orderItem = new OrderItem({
    product: product,
    quantity: quantity,
  });
  await orderItem.save();
  res.json(orderItem);
 } catch (error) {
    handleValidationError(error, req, res);
 }
});

OrderItemRouter.get("/api/v1/order-item/get-all", userAuth, async (req, res) => {
  const getOrderItems = await OrderItem.find();
  try {
    if(!getOrderItems) {
      res.status(500).json({ success: false });
    }
   
    res.status(200).json(getOrderItems);
  } catch (error) {
      res.status(500).json({ success: false });
  }
});


OrderItemRouter.delete("/api/v1/order/deleteById/:id", async (req, res) => {
  const orderItem = await OrderItem.findById(req.params.id);
  try {
    if(!orderItem) {
      return res.status(500).json({ message: "No order item found with this ID " });}

  const deletedOrderItem =  await OrderItem.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Order item deleted successfully.", deleted_orderItem: deletedOrderItem });
  } catch (error) {
   res.status(500).json({ error: error.message });
  }
});

module.exports = OrderItemRouter;
