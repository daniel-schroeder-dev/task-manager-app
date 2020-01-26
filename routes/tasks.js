const express = require('express');
const auth = require('../src/middleware/auth');
const Task = require('../src/models/task');

const router = express.Router();

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

module.exports = router;