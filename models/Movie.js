const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	array: {
		type: String,
		required: true
	},
	approved: {
		type: Boolean,
		required: true
	},
	summary: String,
	url: String,
});

module.exports = mongoose.model('Movies', MovieSchema);