const express = require("express");
const router = express.Router();
const Product = require("../models/product");

const admin = require("../middlewares/admin");
const upload = require("../middlewares/upload_image");
const userAuth = require("../middlewares/auth");

router.post(
  "/api/v1/add-product",
  admin,
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
        image: "",
        images: req.files.map((file) => file.path) ?? [],
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        bestSeller: req.body.bestSeller,
        newArrival: req.body.newArrival,
      });

      await productModel.save();

      res.status(200).json({ productId: productModel });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to add the product", error: error.message });
    }
  },
);

router.get("/api/v1/get-product/:id", async (req, res) => {
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

router.delete("/api/v1/delete-product/:id", admin, async (req, res) => {
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

router.get("/api/v1/product/get-all", async (req, res) => {
  try {
    const allProducts = await Product.find();
    return res.status(200).json(allProducts);
  } catch (error) {
    return res.json(error.message);
  }
});

//get featured product
router.get("/api/v1/product/featured", async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    return res.status(200).json(featuredProducts);
  } catch (error) {
    return res.json(error.message);
  }
});

//get best seller product

router.get("/api/v1/product/best-seller", async (req, res) => {
  try {
    const bestSellerProducts = await Product.find({ bestSeller: true });
    return res.status(200).json(bestSellerProducts);
  } catch (error) {
    return res.json(error.message);
  }
});

// get new arrival product

router.get("/api/v1/product/new-arrival", async (req, res) => {
  try {
    const newArrivalProduct = await Product.find({ newArrival: true });
    return res.status(200).json(newArrivalProduct);
  } catch (error) {
    return res.json(error.message);
  }
});

router.put("/api/v1/update-product/:id", admin, async (req, res) => {
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

module.exports = router;
