const mongoose = require("mongoose");

const offersSchema = mongoose.Schema({
  banner: {
    type: String,
    required: [true, "product banner can not be empty"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, "Offer product can not be Empty"],
  },

});

const OfferSchema = mongoose.model("Offers", offersSchema);
module.exports = OfferSchema;
