const express = require("express");
const router = express.Router();
// const newsModel = require("../models/news");
// const multer = require("multer");
// const path = require("path");
const NewsSchema = require("../models/news");
const upload = require("../helpers/upload_image");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/news/"); // Set the destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     // Set the file name to be unique by appending a timestamp
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
//     );
//   },
// });

// const upload = multer({ storage: storage });

router.post(
  "/api/v1/news/create",
  upload.single("newsImage"),
  async (req, res) => {
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
      await addedNews.save();
      res.status(200).json(addedNews);
    } catch (error) {
      return res.json(error);
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

router.delete("/api/v1/news/deleteById/:id", async (req, res) => {
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

router.put("/api/v1/news/updateById/:id", async (req, res) => {
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
