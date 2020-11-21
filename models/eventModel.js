const config = require('config');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
    location:{
        type: String,
        required: true,
    },
    timeanddate:{
        type:Date
    },
    eventCategory:{
        type: String,
        required: true,
    },
    discount:{
        type: String,
    },
    deal:{
        type: String,
    }
    // add enum
    //add timestamp

});

const event = mongoose.model('Event', eventSchema);

exports.event = Event; 