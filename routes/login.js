const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../src/models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('login', { err: '' });
});

router.post('/', async (req, res, next) => {
  const [ user ] = await User.find({ email: req.body.email });
  if (!user) return res.status(401).render('login', { err: 'Invalid email' });
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) return res.status(401).render('login', { err: 'Invalid password' });
  await user.generateAuthToken();
  await user.save();
  res.cookie('jwt', user.authToken, {
    httpOnly: true,
    expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)),
  });
  res.redirect(303, '/inbox/tasks');
});

module.exports = router;