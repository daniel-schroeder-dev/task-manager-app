const express = require('express');
const auth = require('../src/middleware/auth');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/inbox/tasks', auth, async (req, res, next) => {
  console.log(req.user);
  res.render('dashboard', { pageTitle: 'Inbox' });
});

module.exports = router;
