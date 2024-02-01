const express = require("express");
const Product = require("../models/product");
const CategorySchema = require("../models/category");
const router = express.Router();

//search for product

router.get("/api/v1/products/search/", async (req, res) => {
  const allProducts = await Product.find();
  try {
    const { query } = req.query;
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

router.get("/api/v1/category/search/", async (req, res) => {
  const allCategories = await CategorySchema.find();
  try {
    const { query } = req.query;
    if (!allCategories || query == "")
      return res.status(400).json({ message: "no product found" });
    const searchCategory = allCategories.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase()),
    );
    res.status(200).json(searchCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
