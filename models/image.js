const mongoose = require('mongoose'); 

const imageSchema = mongoose.Schema({
    image : {
        type : String, 
       
    }, 
    email: {
        type: String, 
    }, 
    password: {
        type : String, 
    },
    name : {
        type : String
    }
  
}); 

const ImageSchema = mongoose.model('Image', imageSchema); 
module.exports= ImageSchema;