const mongoose = require('mongoose');

const taskListSchema = new mongoose.Schema({
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  name: String,
  url: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  /* TODO: figure out why timestamps won't work and I have to add this manually */
  createdAt: Date,
});

taskListSchema.statics.createDefaultTaskLists = function(ownerId) {
  
  const defaultTaskListNames = [
    'Today',
    'Week',
    'Inbox',
    'Completed',
    'Trash',
  ];

  defaultTaskListNames.forEach((taskListName) => {
    new this({
      name: taskListName,
      url: '/' + taskListName.toLowerCase(),
      ownerId,
      createdAt: Date.now(),
    }).save();
  });

};

module.exports = mongoose.model('TaskList', taskListSchema);