const config = require('config');
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
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
    status:{
        type:String
    },
    timeHours:{
        type:String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    // add enum
    //add timestamp

});

const event = mongoose.model('Event', EventSchema);

exports.Event = event; 