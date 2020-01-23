const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: String,
  completed: Boolean,
  dueDate: Date,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskList',
  },
});

module.exports = mongoose.model('Task', taskSchema);