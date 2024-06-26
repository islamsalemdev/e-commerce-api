const express = require("express");
const router = express.Router();
const homeSchema = require("../models/home");
const Product = require("../models/product");
const CategorySchema = require("../models/category");
const NewsSchema = require("../models/news");
const OfferSchema = require("../models/offers");


router.get('/api/v1/get-home-features',async (req, res )=>{
    const products = await Product.find();
    const categories = await CategorySchema.find();
    const news = await NewsSchema.find();
    const offers = await OfferSchema.find().populate('product');
         try {
            res.status(200).json({status : "success",products, categories, news, offers});

         } catch (error) {
            res.status(500).json({message: error.message});
         }
});





module.exports = router;
