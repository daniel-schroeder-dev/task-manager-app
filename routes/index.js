const express = require('express');
const auth = require('../src/middleware/auth');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

/* TODO: should load the correct data based on req.url */
router.get('/*', auth, async (req, res, next) => {
  /* TODO: the page title will end up being whatever is stored as the listName in the DB, so you may not need all this URL parsing logic, can just have a URL field in the DB that represents the URL that the list is loaded from and query the list from req.url here. */
  let pageTitle = req.url.replace('/', '');
  pageTitle = pageTitle.replace(/-/gi, ' ');
  let pageTitleArr = pageTitle.split('');
  pageTitleArr[0] = pageTitleArr[0].toUpperCase();
  pageTitle = pageTitleArr.join('');
  res.render('dashboard', { pageTitle, username: req.user.username });
});

module.exports = router;
