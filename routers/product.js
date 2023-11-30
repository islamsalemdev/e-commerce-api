const express = require("express");
const productRouter = express.Router();
const Product = require("../models/product");

productRouter.post("/api/v1/add-product", async (req, res) => {
  const {
    name,
    description,
    richDescription,
    image,
    images,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  const product = await Product.findOne({ name });
  if (product) {
    return res.status(400).json({ message: "this product is aleardy exist" });
  }
  let productModel = new Product({
    name: name,
    description: description,
    richDescription: richDescription,
    image: image,
    images: [],
    brand: brand,
    price: price,
    category: category,
    countInStock: countInStock,
    rating: rating,
    numReviews: numReviews,
    isFeatured: isFeatured,
  });
  await productModel.save();
  res.status(200).json(productModel);
});

productRouter.get("/api/v1/get-all-products", async (req, res) => {
  const productList = await Product.find();
  res.json(productList);
});

module.exports = productRouter;
