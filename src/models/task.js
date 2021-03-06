const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  completed: Boolean,
  dueDate: Date,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskList',
  },
  createdAt: Date,
});

module.exports = mongoose.model('Task', taskSchema);