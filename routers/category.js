const express = require("express");
const router = express.Router();
const Category = require("../models/category");

router.post("/api/v1/add-category", async (req, res) => {
  const { name, icon, color } = req.body;
  const categoryModel = await Category.findOne({ name });
  if (categoryModel) {
    res.status(500).json({
      message: "this category already exist",
    });
  }

  const category = new Category({
    name: name,
    icon: icon,
    color: color,
  });

  await category.save();
  res.json(category);
});

router.get("/api/v1/get-categories", async (req, res) => {
  const getCategories = await Category.find();

  res.json(getCategories);
});

router.put("/api/v1/update-category/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const oldName = category.name;
    if (category.name === req.body.name) {
      return res
        .status(401)
        .json({ message: "This is the old name, please try another name" });
    }

    category.name = req.body.name;
    await category.save();

    res.json({
      message: "Updated Successfully",
      updated_category: category,
      old_name: oldName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/api/v1/delete-category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if the category with the given ID exists
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the category
    await Category.findByIdAndDelete(categoryId);

    res.json({
      message: "Category deleted successfully",
      deleted_category: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
