const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author_name: {
    type: String,
    required: true,
  },
  array: {
    type: String,
    required: true,
  },
  hasInfo: {
    type: Boolean,
    default: false,
  },
  summary: {
    type: String,
    default: '',
  },
  coverPath: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Books', BookSchema);
