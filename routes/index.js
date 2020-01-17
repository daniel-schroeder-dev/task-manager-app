const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../src/models/user');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/inbox/tasks', async (req, res, next) => {
  const _id = await jwt.verify(req.cookies.jwt, 'secret')._id;
  req.user = await User.findById(_id);
  console.log(req.user);
  res.render('dashboard', { pageTitle: 'Inbox' });
});

module.exports = router;
