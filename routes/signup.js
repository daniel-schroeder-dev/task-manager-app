const express = require('express');
const User = require('../src/models/user');
const TaskList = require('../src/models/taskList');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('signup');
});

router.post('/', async (req, res, next) => {
  const user = await User.create(req.body);
  TaskList.createDefaultTaskLists(user._id);
  res.cookie('jwt', user.authToken, {
    httpOnly: true,
    expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)),
  });
  res.redirect(303, '/inbox');
});

module.exports = router;