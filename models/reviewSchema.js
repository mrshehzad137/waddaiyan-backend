const config = require('config');
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    
    eventRating:{
        type: Number,
        required: true,
    },
    overallRating:{
        type: Number,
        required: true,
    },
    comments:{
        type: String,
        required: true,
    },
    user:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }],
    event:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Event'
    }

});

const review = mongoose.model('Review', reviewSchema);

exports.review = Review; 