// const express = require("express");
// const OrderItemRouter = express.Router();
// const Order = require("../models/order");

// // OrderItemRouter.get('/api/v1/get-order-item', (req, res)=> {

// // });

// OrderItemRouter.get("/api/v1/order/create", async (req, res) => {
//   let { product, quantity } = req.body;
//   const orderItem = new OrderItem({
//     product: product,
//     quantity: quantity,
//   });
//   await orderItem.save();
//   res.json(orderItem);
// });

// OrderItemRouter.delete("/api/v1/order/deleteById/:id", async (req, res) => {
//   const getOrder = await Order;
// });

// module.exports = OrderItemRouter;

const express = require("express");
const router = express();

const OrderItem = require("../models/order_item");
const Order = require("../models/order");

router.get("/api/v1/order/getOrdersList", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.json(orderList);
});

router.get("/api/v1/order/getOrderById/:id", async (req, res) => {
  const order = await Order.findById(req.params.id).populate("name", "user");

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

router.post("/api/v1/order/create", async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      user,
      totalPrice,
    } = req.body;
    const orderItemsIds = await Promise.all(
      orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
      }),
    );

    const totalPrices = await Promise.all(
      orderItemsIds.map(async (orderItemId) => {
        const orderItem =
          await OrderItem.findById(orderItemId).populate("product");
        const total = orderItem.product.price * orderItem.quantity;
        return total;
      }),
    );

    const totalPriceOverall = totalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
      orderItems: orderItemsIds, // Use the resolved order item IDs
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPriceOverall,
      user: req.body.user,
    });

    order = await order.save();

    if (!order) {
      return res.status(404).json({ message: "Order cannot be created" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/api/v1/order/updateOrderStatusById/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    },
  );

  if (!order) return res.status(404).send("Order cannot be created");
  res.json(order);
});

router.delete("/api/v1/order/deleteById/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "Order deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Order cannot find" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get("/api/v1/order/getOrdersCount", async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count);
  if (!orderCount) {
    res.status(500), json({ success: false });
  }
  res.status(200).json({
    orderCount: orderCount,
  });
});

router.get("/api/v1/order/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("the order sales cannot be generated");
  }
  res.json({ totalsales: totalSales.pop().totalsales });
});

router.get("/api/v1/order/getUserOrderByUserId/:id", async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

module.exports = router;
