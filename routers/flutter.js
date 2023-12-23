const multer = require("multer");
const path = require("path");
const express = require("express");
const { model } = require("mongoose");
const router = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/flutter"); // Set the destination folder for uploaded files
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

router.post("/api/v1/flutter", upload.single("image"), (req, res) => {
  try {
    res.status(200).json({
      image_path: req.file.path,
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
