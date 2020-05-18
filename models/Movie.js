const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	summary: String,
	url: String,
	approved: Boolean
});

module.exports = mongoose.model('Movies', MovieSchema);