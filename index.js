const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require('./routers/auth');


//middleware
app.use(express.json());
app.use(authRouter);

//connect DB
const DB =
  "mongodb+srv://islamrabi3:123456789islam@cluster0.qvp8pzl.mongodb.net/";
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
