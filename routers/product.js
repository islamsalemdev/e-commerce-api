const express = require("express");
const productRouter = express.Router();
const Product = require("../models/product");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Set the file name to be unique by appending a timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

productRouter.post(
  "/api/v1/add-product",
  upload.array("images", 3),
  async (req, res) => {
    try {
      // Check if the product with the given name already exists
      const existingProduct = await Product.findOne({ name: req.body.name });

      if (existingProduct) {
        return res.status(400).json({ message: "This product already exists" });
      }

      let productModel = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.files[0].path, // Assuming you want to save the path of the first image as the main image
        images: req.files.map((file) => file.path),
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      });

      await productModel.save();
      res.status(200).json(productModel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

productRouter.get("/api/v1/get-product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Use findById to get a single product by ID
    const product = await Product.findById(productId).populate({
      path: "category", // Assuming "category" is the field name in your Product model
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

productRouter.delete("/api/v1/delete-product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Use findById to get a single product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne(product._id);
    res.json({
      message: "Product Deleted Successfully",
      deleted_product: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

productRouter.get("/api/v1/product/get-all", async (req, res) => {
  try {
    const allProducts = await Product.find();
    return res.status(200).json(allProducts);
  } catch (error) {
    return res.json(error.message);
  }
});

productRouter.get("/api/v1/product/featured", async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: false });
    return res.status(200).json(featuredProducts);
  } catch (error) {
    return res.json(error.message);
  }
});

module.exports = productRouter;
