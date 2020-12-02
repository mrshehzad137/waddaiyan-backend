const config = require('config');
const mongoose = require('mongoose');

const promocodeSchema = new mongoose.Schema({
    
    code:{
        type: String,
        required: true,
    },
    vendor:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Customer' 
    }],
    expirydate: {
        type:Date
    },
    discount: {
        type : String
    }

});

const promoCode = mongoose.model('PromoCode', promocodeSchema);

exports.PromoCode = promoCode;