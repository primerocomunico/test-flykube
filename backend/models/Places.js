const mongoose = require('mongoose');

// const placeSchema = mongoose.Schema({
//     placeName: {
//         type: String,
//         required: true
//     },
//     departure: {
//         type: Date,
//         default: Date.now
//     }
// });

const placeSchema = mongoose.Schema({
    ID: {
        type: Number,
        required: true
    },
    Title: {
        type: String
    },
    DueDate: {
        type: Date
    },
    Completed: {
        type: Boolean
    }
});

module.exports = mongoose.model('infoPlace', placeSchema);