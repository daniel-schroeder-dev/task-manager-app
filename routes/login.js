const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('login');
});

router.post('/', (req, res, next) => {
  res.redirect(303, '/inbox/tasks');
});

module.exports = router;