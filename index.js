const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
const orderItemRouter = require("./routers/orderItem");
const categoryRouter = require("./routers/category");
const wishlistRouter = require("./routers/wishlist");
const newsRouter = require("./routers/news_router");
const i18n = require("i18n");
const flutterRouter = require("./routers/flutter");
const path = require("path");
const langRouter = require("./routers/lang");

//middleware
app.use(express.json());

//localization
i18n.configure({
  locales: ["en", "ar"],
  defaultLocale: "en",
  directory: __dirname + "/locales",
  objectNotation: true,
});

// Use i18n middleware
app.use(i18n.init);

// Routers
app.use(authRouter);
app.use(langRouter);
app.use(flutterRouter);
app.use(productRouter);
app.use(wishlistRouter);
app.use(newsRouter);
app.use(orderItemRouter);
app.use(categoryRouter);

//connect DB
const DB =
  "mongodb+srv://islamrabi3:123456789islam@cluster0.qvp8pzl.mongodb.net/albostan";

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
