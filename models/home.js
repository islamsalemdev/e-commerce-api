

const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Category",
  },
  news: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "news_schema",
  },
  offers : {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Offers",
  }
});

const HomeSchema = mongoose.model("homeSchema", homeSchema);
module.exports = HomeSchema;
