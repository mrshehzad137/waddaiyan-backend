const config = require('config');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    
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
    }

});

const event = mongoose.model('Event', eventSchema);

exports.event = Event; 