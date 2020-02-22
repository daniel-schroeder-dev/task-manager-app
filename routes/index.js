const express = require('express');
const auth = require('../src/middleware/auth');
const TaskList = require('../src/models/taskList');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/*', auth, async (req, res, next) => {
  console.log('\n\n\n\n\n\n\n\n\n\n');
  const defaultTaskLists = [ 'Inbox', 'Today', 'Week', 'Trash', 'Completed' ];
  const findIncompleteTasks = (taskListName) => taskLists.find(taskList => taskList.name === taskListName).tasks.filter(task => !task.completed);
  const taskList = await TaskList.findOne({ url: req.url }).populate('tasks').exec();
  let taskLists = await TaskList.find({ ownerId: req.user._id }).populate('tasks').exec();
  if (taskLists.length > 1) {
    taskLists = taskLists.sort((a, b) => {
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });
  }
  if (taskList.tasks.length) {
    taskList.tasks = taskList.tasks.sort((a, b) => {
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });
  }
  res.render('dashboard', { pageTitle: taskList.name, username: req.user.username, taskLists, tasks: taskList.tasks, defaultTaskLists, findIncompleteTasks });
});

module.exports = router;
