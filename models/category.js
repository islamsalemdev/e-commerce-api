const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name can not be empty"],
  },
  icon: {
    type: String,
    required: [true, "Category icon can not be Empty"],
  },
  color: {
    type: String,
  },
});

const CategorySchema = mongoose.model("Category", categorySchema);
module.exports = CategorySchema;
