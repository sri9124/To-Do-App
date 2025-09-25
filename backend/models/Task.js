const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  timeAmPm: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);