const express = require('express');
const auth = require('../src/middleware/auth');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

/* TODO: should load the correct data based on req.url */
router.get('/*', auth, async (req, res, next) => {
  /* TODO: make this better... */
  let pageTitle = req.url.replace('/', '');
  let pageTitleArr = pageTitle.split('');
  pageTitleArr[0] = pageTitleArr[0].toUpperCase();
  pageTitle = pageTitleArr.join('');
  res.render('dashboard', { pageTitle, username: req.user.username });
});

module.exports = router;
