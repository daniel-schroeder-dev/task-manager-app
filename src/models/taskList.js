const mongoose = require('mongoose');

const taskListSchema = new mongoose.Schema({
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  name: String,
  pageUrl: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  /* TODO: figure out why timestamps won't work and I have to add this manually */
  createdAt: Date,
});

module.exports = mongoose.model('TaskList', taskListSchema);