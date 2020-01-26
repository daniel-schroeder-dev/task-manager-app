const express = require('express');
const auth = require('../src/middleware/auth');
const TaskList = require('../src/models/taskList');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/*', auth, async (req, res, next) => {
  const [ taskList ] = await TaskList.find({ url: req.url }).populate('tasks').exec();
  let taskLists = await TaskList.find( { ownerId: req.user._id });
  taskLists = taskLists.sort((a, b) => {
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
  taskList.tasks = taskList.tasks.sort((a, b) => {
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
  res.render('dashboard', { pageTitle: taskList.name, username: req.user.username, taskLists, tasks: taskList.tasks });
});

module.exports = router;
