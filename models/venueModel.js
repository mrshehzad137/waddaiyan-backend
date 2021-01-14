const config = require('config');
const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    description:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Review' 
    }],
    vendors:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Customer' 
    },
    location:{
        type: String,
        required: true,
    },
    discount:{
        type: String,
    },
    deal:{
        type: String,
    },
    pictures:[{
        type:String
    }],
    status:{
        type:String
    },
    charges:{
        type:Number
    }
});

const venue = mongoose.model('Venue', VenueSchema);

exports.Venue = venue; 