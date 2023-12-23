const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist_model");
const mongoose = require("mongoose");
const WishlistModel = require("../models/wishlist_model");

router.post("/api/v1/wishlist/add-product", async (req, res) => {
  try {
    const existedProduct = await Wishlist.findOne({
      product: req.body.product,
      user: req.body.user,
    });
    if (existedProduct) {
      return res.status(401).json({
        message: "This product already exist",
      });
    }
    const wishListProduct = new Wishlist({
      product: req.body.product,
      user: req.body.user,
    });
    await wishListProduct.save();
    return res
      .status(200)
      .json({ message: "product has been added to wishlist", wishListProduct });
  } catch (error) {
    return res.json({ message: error.message });
  }
});

router.get("/api/v1/wishlist/get-products", async (req, res) => {
  try {
    //   const existedProduct = await Wishlist.findOne({
    //     product: req.body.product,
    //     user: req.body.user,
    //   });
    //   if (existedProduct) {
    //     return res.status(401).json({
    //       message: "This product already exist",
    //     });
    //   }
    const wishProduct = await Wishlist.find().populate({
      path: "product user",
    });
    // await wishProduct.save();
    return res.status(200).json(wishProduct);
  } catch (error) {
    return res.json({ message: error.message });
  }
});

// get wishlist for specific user
router.get("/api/v1/wishlist/get-products/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userWishlist = await WishlistModel.find({ user: userId }).populate({
      path: "product user",
    });
    if (!userWishlist) {
      res.status(401).json({ message: "No Product found" });
    }
    res.status(201).json(userWishlist);
    // const wishProduct = await Wishlist.find().populate({
    //   path: "product user",
    // });
    // // await wishProduct.save();
    // return res.status(200).json(wishProduct);
  } catch (error) {
    return res.json({ message: error.message });
  }
});

router.delete(
  "/api/v1/wishlist/delete-product/:userId/:productId",
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const userId = req.params.userId;

      // Use findById to get a single product by ID
      const product = await WishlistModel.findOne({
        user: userId,
        product: productId,
      });

      // if (!product) {
      //   return res.status(404).json({ message: "Product not found" });
      // }

      await WishlistModel.deleteOne(product);
      res.json({
        message: "Product Deleted Successfully",
        deleted_product: product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.delete(
  "/api/v1/wishlist/delete-all-product/:userId",
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const existedProduct = await WishlistModel.findOne({ user: userId });
      if (!existedProduct) {
        res.status(402).json({ message: "Product not found" });
      }

      const deletedProduct = await WishlistModel.findOneAndDelete({
        user: userId,
      })
        .populate({ path: "product" })
        .exec();
      res.json({
        message: "Product Deleted Successfully",
        deleted_product: deletedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

module.exports = router;
