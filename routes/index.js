const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/inbox/tasks', (req, res, next) => {
  res.render('dashboard', { pageTitle: 'Inbox' });
});

module.exports = router;
