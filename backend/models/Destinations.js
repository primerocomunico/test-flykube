const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
	placeName: {
		type: String,
		required: true,
	},
	departure: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Destinations', placeSchema);
