const express = require("express");
const productRouter = express.Router();
const Product = require("../models/product");

productRouter.post("/api/v1/post-product", async (req, res) => {
    const { name, description, brand, price, isFeatured, rating, stock } =
    req.body;
 
  const product = await Product.findOne({name});
  if (product) {
    return res.status(400).json({ message: "this product is aleardy exist" });
  }
  let productObj = new Product({
      name: name,
      description: description,
      brand: brand,
      price: price,
      isFeatured,
      isFeatured,
      rating: rating,
      stock: stock,
    });
    await  productObj.save();
  res.status(200).json(productObj);

  
});

productRouter.get("/api/v1/get-all-products", async (req, res) => {
  const productList = await Product.find();
  res.json(productList);


});




module.exports = productRouter;
