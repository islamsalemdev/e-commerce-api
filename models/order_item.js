const mongoose = require('mongoose'); 

const orderItemSchema = mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'Product'
    }, 
    quantity: {
        type: Number, 
        default : 0 
    }
}); 

const OrderItem = mongoose.model('OrderItem', orderItemSchema); 
module.exports= OrderItem;