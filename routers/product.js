const express = require("express");
const productRouter = express.Router();
const Product = require("../models/product");
const multer = require("multer");
const path = require("path");
const isAdmin = require("../middlewares/admin");
const admin = require("../middlewares/admin");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Set the destination folder for uploaded files
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
// post new product

const upload = multer({ storage: storage });

productRouter.post(
  "/api/v1/add-product",
  isAdmin,
  upload.array("images", 3),
  async (req, res) => {
    try {
      const existingProduct = await Product.findOne({ name: req.body.name });

      if (existingProduct) {
        return res.status(400).json({ message: "This product already exists" });
      }

      const productModel = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.files[0].path ?? "",
        images: req.files.map((file) => file.path) ?? [],
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      });

      await productModel.save();

      res.status(200).json({ productId: productModel._id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to add the product", error: error.message });
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
    const featuredProducts = await Product.find({ isFeatured: true });
    return res.status(200).json(featuredProducts);
  } catch (error) {
    return res.json(error.message);
  }
});

productRouter.put("/api/v1/update-product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Use findById to get a single product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name;
    product.price = req.body.price ?? product.price;
    product.isFeatured = req.body.isFeatured ?? product.isFeatured;
    await product.save();
    res.json({
      message: "Product updated  Successfully",
      deleted_product: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = productRouter;
