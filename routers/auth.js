const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

authRouter.post("/api/v1/register", async (req, res) => {
  var {
    name,
    email,
    password,
    address,
    isAdmin,
    city,
    apartment,
    street,
    zip,
    country,
  } = req.body;
  const existUser = await User.findOne({ email });

  try {
    if (existUser) {
      return res.json({
        message: "this user is already registerd",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      isAdmin: isAdmin,
      city: city,
      apartment: apartment,
      street: street,
      zip: zip,
      country: country,
    });
    user = await user.save();

    res.json({ status: "Success", user_data: user });
  } catch (error) {
    res.json({ error_message: error });
    console.log(error);
  }
});

authRouter.post("/api/v1/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.put("/api/v1/userUpdatePassword/:id", async (req, res) => {
  try {
    const password = req.body.password;

    const user = await User.findById(req.params.id);
    if (user.password == password) {
      return res.status(400).json({ msg: "This password used before" });
    }
    //    if (password === user.password) {
    //     return res.status(400).json({message:"this password is already exsit"});
    //    }
    user.password = password;
    await user.save();

    res.json({ message: "password updated", new_password: user.password });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
authRouter.get("/api/v1/getUserData/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ msg: "This user is not exist" });
    }
    //    if (password === user.password) {
    //     return res.status(400).json({message:"this password is already exsit"});
    //    }

    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

<<<<<<< HEAD
authRouter.get("/api/v1/get-users", async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
=======
authRouter.get("/api/v1/getAllUsers", async (req, res) => {
  try {
    const allUsers = await User.find();
    if (!allUsers) {
>>>>>>> b6af6dce8d193dc9956b2b3edaca465fd9615e9e
      return res.status(400).json({ msg: "Something went wrong" });
    }
    //    if (password === user.password) {
    //     return res.status(400).json({message:"this password is already exsit"});
    //    }

<<<<<<< HEAD
    res.json(user);
=======
    res.json(allUsers);
>>>>>>> b6af6dce8d193dc9956b2b3edaca465fd9615e9e
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
<<<<<<< HEAD
=======

>>>>>>> b6af6dce8d193dc9956b2b3edaca465fd9615e9e
module.exports = authRouter;