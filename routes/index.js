const express = require('express');
const auth = require('../src/middleware/auth');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/inbox/tasks', auth, async (req, res, next) => {
  res.render('dashboard', { pageTitle: 'Inbox', username: req.user.username });
});

module.exports = router;
