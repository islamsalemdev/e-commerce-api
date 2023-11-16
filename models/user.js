const mongoose = require("mongoose");
const { productSchema } = require("./product");

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
 
  password: {
    required: true,
    type: String,
  },
  address: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date_of_birth: {
    type : String,
    default :''
    
  }, 
  phone_number:{
    type : Number, 
  }, 
  wishlist : 
     {
      type: mongoose.Schema.Types.ObjectId, 
      ref : 'Product',
     }

  , 
  // image : {
  //   type : String, 
  // }
});
const User = mongoose.model("User", userSchema);
module.exports = User;
