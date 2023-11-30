const express = require("express");
const app = express();
const mongoose = require("mongoose");
<<<<<<< HEAD
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
const orderItemRouter = require("./routers/orderItem");
=======
const authRouter = require('./routers/auth');
const productRouter = require('./routers/product');
const orderItemRouter = require('./routers/orderItem');
const imageRouter = require("./routers/image_router");

>>>>>>> b6af6dce8d193dc9956b2b3edaca465fd9615e9e

//middleware
app.use(express.json());
app.use(authRouter);
app.use(productRouter);
app.use(orderItemRouter);
app.use(imageRouter);

//connect DB
const DB =
<<<<<<< HEAD
  "mongodb+srv://islamrabi3:123456789islam@cluster0.qvp8pzl.mongodb.net/albostan";
=======
  "mongodb+srv://islamrabi3:123456789islam@cluster0.qvp8pzl.mongodb.net/ecommerce";
>>>>>>> b6af6dce8d193dc9956b2b3edaca465fd9615e9e
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB Connected Successfully ");
  })
  .catch((err) => {
    console.log(err);
  });

// Connect to the Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Servers is working successfully");
});
