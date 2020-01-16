const express = require('express');
const User = require('../src/models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('signup');
});

router.post('/', (req, res, next) => {
  console.log(new User(req.body));
  res.redirect(303, '/inbox/tasks');
});

module.exports = router;