const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

authRouter.post("/api/v1/signup", async (req, res) => {
  var { name, email, password, address, isAdmin , wishlist } = req.body;
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
      wishlist :wishlist 
    });
    user = await user.save();

    res.json({ status: "Success", user_data: user });
  } catch (error) {
    res.json({ error_message: error });
    console.log(error);
  }
});

authRouter.post("/api/v1/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
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

module.exports = authRouter;
