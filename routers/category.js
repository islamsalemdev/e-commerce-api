const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const admin = require("../middlewares/admin");

router.post("/api/v1/category/add", admin, async (req, res) => {
  try {
    const { name, icon, color } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(500).json({
        message: "This category already exists",
      });
    }

    // Create a new category model
    const newCategory = new Category({
      name: name,
      icon: icon,
      color: color,
    });

    // Save the new category to the database
    await newCategory.save();

    res.status(200).json({
      message: "Category has been created",
      category: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/api/v1/category/get-all", async (req, res) => {
  const getCategories = await Category.find();

  res.json(getCategories);
});

router.put("/api/v1/category/update/:id", async (req, res) => {
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

router.delete("/api/v1/category/delete/:id", async (req, res) => {
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
