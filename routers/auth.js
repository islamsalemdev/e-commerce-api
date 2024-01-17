const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const userAuth = require("../middlewares/auth");

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
    role,
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
      role: role,
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

authRouter.put("/api/v1/update-user/:id", userAuth, async (req, res) => {
  try {
    const password = req.body.password;

    // Use findByIdAndUpdate instead of findOneAndUpdate
    const findUserAndUpdatePassword = await User.findByIdAndUpdate(
      req.params.id,
      { password: password },
      { new: true }, // This ensures you get the updated document
    );

    // Check if the user is found
    if (!findUserAndUpdatePassword) {
      return res.status(404).json({ msg: "User not found" });
    }

    // The updated user is now findUserAndUpdatePassword, not user
    res.json({
      message: "Password updated",
      new_password: findUserAndUpdatePassword,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.get("/api/v1/get-user/:id", async (req, res) => {
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

authRouter.get("/api/v1/get-all-users", async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(400).json({ msg: "Something went wrong" });
    }
    //    if (password === user.password) {
    //     return res.status(400).json({message:"this password is already exsit"});
    //    }

    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.delete("/api/v1/delete-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOneAndDelete(userId);
    if (!user) {
      return res.status(400).json({ msg: "This user is not exist" });
    }
    //    if (password === user.password) {
    //     return res.status(400).json({message:"this password is already exsit"});
    //    }

    res.json({ message: "User deleted", deleted_user: user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
module.exports = authRouter;
