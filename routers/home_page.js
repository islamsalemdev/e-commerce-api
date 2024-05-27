const express = require('express');
const userAuth = require('../middlewares/auth');
const CategorySchema = require('../models/category');
const Product = require('../models/product');
const NewsSchema = require('../models/news');
const OfferSchema = require('../models/offers');
const router = express.Router();

router.get('/api/v1/homepage', async(req , res )=> {
  const categories = await CategorySchema.find();
  const products =await  Product.find();
  const news = await NewsSchema.find();
  const offers = await OfferSchema.find();
  try {
    res.status(200).json({
        status: 'success',
        products : products ?? [],
        categories : categories ?? [],
        news : news ?? [], 
        offers : offers ?? []
    });
  } catch (error) {
    res.status(500).json({
        status: 'fail',
        message: error
    });
  }
});

module.exports = router;