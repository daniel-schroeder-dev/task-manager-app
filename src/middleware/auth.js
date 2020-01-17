const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const _id = await jwt.verify(req.cookies.jwt, 'secret')._id;
  req.user = await User.findById(_id);
  next();
};