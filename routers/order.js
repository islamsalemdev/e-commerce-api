const express = require("express");
const router = express();

const OrderItem = require("../models/order_item");
const Order = require("../models/order");
const admin = require("../middlewares/admin");
const userAuth = require("../middlewares/auth");

router.get("/api/v1/order/getOrdersList", userAuth, async (req, res) => {
  const orderList = await Order.find()
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

router.get("/api/v1/order/getOrderById/:id", userAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

router.post("/api/v1/order/create", userAuth, async (req, res) => {
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
      // Assuming req.user contains the authenticated user information
      totalPrice,
    } = req.body;

    // Save order items
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

    // Calculate total prices
    const totalPrices = await Promise.all(
      orderItemsIds.map(async (orderItemId) => {
        const orderItem =
          await OrderItem.findById(orderItemId).populate("product");

        // Check if orderItem.product exists before accessing its properties
        if (orderItem.product && orderItem.product.price) {
          const total = orderItem.product.price * orderItem.quantity;
          return total;
        } else {
          throw new Error("Product or product price is null or undefined");
        }
      }),
    );

    // Calculate overall total price
    const totalPriceOverall = totalPrices.reduce((a, b) => a + b, 0);

    // Create the order
    let order = new Order({
      orderItems: orderItemsIds,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice: totalPriceOverall,
      user: req.user,
    });

    // Save the order
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
router.patch(
  "/api/v1/order/updateOrderStatusById/:id",
  admin,
  async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.delete("/api/v1/order/deleteById/:id", userAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  try {
    if (!order) {
      return res.status(500).json({ message: "No order found with this ID " });
    }
    if (order.status != "pending") {
      return res.status(403).json({
        message: "you can not delete this order in if status not Pending.",
      });
    }

    // Delete the order
    await Order.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ message: "Order deleted successfully.", deleted_order: order });
  } catch (error) {}
  // Order.findByIdAndRemove(req.params.id)
  //   .then(async (order) => {
  //     if (order) {
  //       await order.orderItems.map(async (orderItem) => {
  //         await OrderItem.findByIdAndRemove(orderItem);
  //       });
  //       return res
  //         .status(200)
  //         .json({ success: true, message: "Order deleted successfully" });
  //     } else {
  //       return res
  //         .status(404)
  //         .json({ success: false, message: "Order cannot find" });
  //     }
  //   })
  //   .catch((err) => {
  //     return res.status(400).json({ success: false, error: err });
  //   });
});

router.get("/api/v1/order/getOrdersCount", admin, async (req, res) => {
  try {
    const orderCount = await Order.countDocuments({});

    if (orderCount === null || orderCount === undefined) {
      res.status(500).json({ success: false });
    } else {
      res.status(200).json({
        orderCount: orderCount,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

router.get("/api/v1/order/totalsales", admin, async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);

    if (totalSales.length === 0) {
      return res.status(400).json({ message: "No order sales found" });
    }

    res.json({ totalsales: totalSales[0].totalsales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get(
  "/api/v1/order/getUserOrderByUserId/:id",
  admin,
  async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.id })
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
  },
);

module.exports = router;
