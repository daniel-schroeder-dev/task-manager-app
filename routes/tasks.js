const express = require('express');
const auth = require('../src/middleware/auth');
const Task = require('../src/models/task');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.post('/', auth, async (req, res, next) => {
  req.body.createdAt = Date.now();
  const task = new Task(req.body);
  try {
    await task.save();
  } catch (e) {
    console.log(e);
  }
  res.json(task);
});

router.put('/', auth, async (req, res, next) => {
  const updatedTask = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true });
  res.json(updatedTask);
});

module.exports = router;