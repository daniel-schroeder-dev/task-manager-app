const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('signup');
});

router.post('/', (req, res, next) => {
  res.json({ body: req.body });
});

module.exports = router;