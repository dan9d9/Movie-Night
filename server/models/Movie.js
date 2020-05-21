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
	hasInfo: {
		type: Boolean,
		default: false
	},
	summary: {
		type: String,
		default: ''
	},
	posterPath: {
		type: String,
		default: ''
	},
	videoPaths: {
		type: Array,
		default: []
	}
});

module.exports = mongoose.model('Movies', MovieSchema);