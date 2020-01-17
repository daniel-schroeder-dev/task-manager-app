const express = require('express');
const User = require('../src/models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('signup');
});

router.post('/', async (req, res, next) => {
  await User.create(req.body);
  res.redirect(303, '/inbox/tasks');
});

module.exports = router;