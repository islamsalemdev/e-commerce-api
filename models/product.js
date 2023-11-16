const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  // image: {
  //   type: String,
  //   default: '',
  // },
  brand: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  
  isFeatured: {
    type: Boolean,
    required: true,
  },
  rating :{
    type : Number
  }, 
  // Category :{
  //   type : mongoose.Schema.Types.ObjectId,
  //   ref : "Category"
  // }, 
  stock :{
    type : Number , 
    default:0
  }

});

const Product = mongoose.model('Product', productSchema); 
module.exports= Product;
