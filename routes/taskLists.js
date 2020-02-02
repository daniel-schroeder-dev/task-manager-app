const express = require('express');
const auth = require('../src/middleware/auth');
const TaskList = require('../src/models/taskList');
const Task = require('../src/models/task');

const router = express.Router();

router.post('/:id/tasks', auth, async (req, res, next) => {
  const taskList = await TaskList.findById(req.params.id);
  taskList.tasks.push(req.body._id);
  await taskList.save();
  res.json(taskList);
});

router.delete('/:id/tasks', auth, async (req, res, next) => {
  const taskList = await TaskList.findById(req.params.id);
  await Task.deleteMany({ _id: { $in: taskList.tasks }});
  taskList.tasks = [];
  await taskList.save();
  res.json(taskList);
});

router.delete('/:id/tasks/:taskId', auth, async (req, res, next) => {
  
  const taskList = await TaskList.findById(req.params.id);
  
  /*
  *   Since task will be an ObjectID, we need to use the .equals method to 
  *   compare it with the ObjectID passed in on req.params.taskId. Simple 
  *   string comparisons won't work.
  */
  taskList.tasks = taskList.tasks.filter(task => {
    return !task.equals(req.params.taskId);
  });

  await taskList.save();
  res.json(taskList);

});

router.get('/', auth, async (req, res, next) => {
  const taskLists = await TaskList.find().populate('tasks').exec();
  res.json(taskLists);
});

router.post('/', auth, async (req, res, next) => {
  req.body.ownerId = req.user._id;
  req.body.createdAt = Date.now();
  const taskList = new TaskList(req.body);
  try {
    await taskList.save();
  } catch (e) {
    console.log(e);
  }
  res.json(taskList);
});

module.exports = router;