const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  authToken: String,
});

userSchema.statics.create = async function(userData) {
  const saltRounds = 10;
  const user = new this(userData);
  user.password = await bcrypt.hash(user.password, saltRounds);
  user.authToken = await jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d'});
  await user.save();
  return user;
};

module.exports = mongoose.model('User', userSchema);