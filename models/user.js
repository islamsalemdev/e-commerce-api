const mongoose = require("mongoose");
const { productSchema } = require("./product");

const userSchema = mongoose.Schema(
  {
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
      type: String,
      required: true,
      min: [8, "password must be more than 8 characters"],
    },
    phone: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    
    },
  
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User", userSchema);
module.exports = User;
