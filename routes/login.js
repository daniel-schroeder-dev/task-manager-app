const express = require('express');
const User = require('../src/models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('login');
});

router.post('/', async (req, res, next) => {
  const [ user ] = await User.find({ email: req.body.email });
  await user.generateAuthToken();
  await user.save();
  res.cookie('jwt', user.authToken, {
    httpOnly: true,
    expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)),
  });
  res.redirect(303, '/inbox/tasks');
});

module.exports = router;