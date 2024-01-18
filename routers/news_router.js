const express = require("express");
const router = express.Router();

const NewsSchema = require("../models/news");
const admin = require("../middlewares/admin");
const upload = require("../middlewares/upload_image");
const handleValidationError = require("../middlewares/error_handler");

router.post(
  "/api/v1/news/create",
  upload.single("image"),
  admin,

  async (req, res, next) => {
    try {
      const existedNews = await NewsSchema.findOne({ title: req.body.title });

      if (existedNews) {
        return res.status(400).json({ message: "This News already exist" });
      }

      const addedNews = new NewsSchema({
        title: req.body.title,
        content: req.body.content,
        image: req.file.path,
      });
      addedNews.validateSync();

      await addedNews.save();
      res.status(200).json(addedNews);
    } catch (error) {
      handleValidationError(error, req, res);
    }
  },
);

router.get("/api/v1/news/getById/:id", admin, async (req, res) => {
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

router.get("/api/v1/news/get-all", admin, async (req, res) => {
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

router.put("/api/v1/news/updateById/:id", admin, async (req, res) => {
  try {
    const news = await NewsSchema.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "news not found" });
    }
    const oldName = news.title;
    if (news.title === req.body.title) {
      return res
        .status(401)
        .json({ message: "This is the old name, please try another name" });
    }

    news.title = req.body.title;
    await news.save();

    res.json({
      message: "Updated Successfully",
      updated_news: news,
      old_name: oldName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
