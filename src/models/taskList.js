const mongoose = require('mongoose');

const taskListSchema = new mongoose.Schema({
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  name: String,
  pageUrl: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('TaskList', taskListSchema);