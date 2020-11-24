const config = require('config');
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    
    rating: {
        type: Number,
        required: true,
    },
    comments: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
});

const review = mongoose.model('Review', reviewSchema);

exports.Review = review; 