const mongoose = require("mongoose");
const newsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title must be filled"],
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const NewsSchema = mongoose.model("news_schema", newsSchema);
module.exports = NewsSchema;
