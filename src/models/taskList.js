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

const defaultTaskListNames = [
  'Today',
  'Week',
  'Inbox',
  'Completed',
  'Trash',
];

taskListSchema.statics.createDefaultTaskLists = function(ownerId) {

  defaultTaskListNames.forEach((taskListName) => {
    new this({
      name: taskListName,
      url: '/' + taskListName.toLowerCase(),
      ownerId,
      createdAt: Date.now(),
    }).save();
  });

};

taskListSchema.statics.findUserCreatedTaskLists = function(ownerId) {
  return this.find({ ownerId, name: { $nin: defaultTaskListNames}});
};

module.exports = mongoose.model('TaskList', taskListSchema);