const express = require("express");
const router = express.Router();

const NewsSchema = require("../models/news");
const admin = require("../middlewares/admin");
const upload = require("../middlewares/upload_image");
const handleValidationError = require("../middlewares/error_handler");

router.post(
  "/api/v1/news/create",
  admin,
  upload.single("image"),
  async (req, res) => {
    try {
      const existedNews = await NewsSchema.findOne({ title: req.body.title });

      if (existedNews) {
        return res.status(400).json({ message: "This News already exist" });
      }
      const addedNews = new NewsSchema({
        title: req.body.title,
        content: req.body.content,
        image: req.file ? req.file.path : " ",
      });
      await addedNews.save();
      res.status(200).json(addedNews);
    } catch (error) {
      handleValidationError(error, req, res);
    }
  },
);

router.get("/api/v1/news/getById/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Use findById to get a single product by ID
    const news = await NewsSchema.findById(productId);

    if (!news) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/api/v1/news/get-all", async (req, res) => {
  try {
    // Use findById to get a single product by ID
    const product = await NewsSchema.find();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/api/v1/news/deleteById/:id", admin, async (req, res) => {
  try {
    const newsId = req.params.id;

    // Use findById to get a single product by ID
    const news = await NewsSchema.findById(newsId);

    if (!news) {
      return res.status(404).json({ message: "news not found" });
    }

    await news.deleteOne(news._id);
    res.json({
      message: "Product Deleted Successfully",
      deleted_news: news,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/api/v1/news/updateById/:id", admin, async (req, res) => {
  try {
    const updatedNews = await NewsSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      },
      {
        new: true,
      },
    );

    if (!updatedNews) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      message: "Password updated successfully",
      updatedUser: updatedNews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
