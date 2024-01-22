const express = require("express");
const Product = require("../models/product");
const CategorySchema = require("../models/category");
const router = express.Router();

//search for product

router.post("/api/v1/products/search/", async (req, res) => {
  const allProducts = await Product.find();
  try {
    const { query } = req.body;
    if (!allProducts)
      return res.status(400).json({ message: "no product found" });
    const searchProduct = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );
    res.status(200).json(searchProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// search category

router.post("/api/v1/category/search/", async (req, res) => {
  const allProducts = await CategorySchema.find();
  try {
    const { query } = req.body;
    if (!allProducts || query == "")
      return res.status(400).json({ message: "no product found" });
    const searchProduct = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );
    res.status(200).json(searchProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
