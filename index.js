const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
const orderItemRouter = require("./routers/orderItem");
const categoryRouter = require("./routers/category");
const wishlistRouter = require("./routers/wishlist");
const newsRouter = require("./routers/news_router");
const orderRouter = require("./routers/order");
const searchRouter = require("./routers/search");
const homeRouter = require("./routers/home");
const i18n = require("i18n");
const path = require("path");
const langRouter = require("./routers/lang");
const cors = require("cors");
require("dotenv").config();

//middleware

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//localization
i18n.configure({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  directory: __dirname + "/locales",
  objectNotation: true,
});

// Use i18n middleware
app.use(i18n.init);

// Routers
app.use(authRouter);
app.use(searchRouter);
app.use(homeRouter);
app.use(langRouter);
app.use(orderRouter);
app.use(productRouter);
app.use(wishlistRouter);
app.use(newsRouter);
app.use(orderItemRouter);
app.use(categoryRouter);

//connect DB
const DB = process.env.DB_CON;

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
app.listen(PORT, () => {
  console.log("Servers is working successfully");
});
