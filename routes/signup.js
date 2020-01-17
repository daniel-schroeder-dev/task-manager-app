const express = require('express');
const User = require('../src/models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('signup');
});

router.post('/', async (req, res, next) => {
  const user = await User.create(req.body);
  console.log(user);
  res.redirect(303, '/inbox/tasks');
});

module.exports = router;