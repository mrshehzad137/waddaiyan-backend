const config = require('config');
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    
    location:{
        type: String,
        required: true,
    },
    user:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }],
    event:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Event'
    },
    vendor:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Customer' 
    }],
    timeanddate:{
        type:Date
    },
    venue:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Venue'
    }

});

const booking = mongoose.model('Booking', bookingSchema);

exports.Booking = booking; 