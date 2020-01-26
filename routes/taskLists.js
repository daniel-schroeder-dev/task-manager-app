const express = require('express');
const auth = require('../src/middleware/auth');
const TaskList = require('../src/models/taskList');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  const taskLists = await TaskList.find();
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