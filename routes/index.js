const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/inbox/tasks', (req, res, next) => {
  var body = '';
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
  }
  console.log(req.session);
  res.render('dashboard', { pageTitle: 'Inbox', views: req.session.views });
});

module.exports = router;
