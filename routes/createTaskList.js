const express = require('express');
const auth = require('../src/middleware/auth');
const TaskList = require('../src/models/taskList');

const router = express.Router();

router.post('/', auth, async (req, res, next) => {
  req.body.ownerId = req.user._id;
  const taskList = new TaskList(req.body);
  try {
    await taskList.save();
  } catch (e) {
    console.log(e);
  }
  res.json(taskList);
});

module.exports = router;