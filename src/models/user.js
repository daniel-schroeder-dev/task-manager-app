const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

userSchema.statics.create = async function(userData) {
  const saltRounds = 10;
  const user = new this(userData);
  user.password = await bcrypt.hash(user.password, saltRounds);
  return user;
};

module.exports = mongoose.model('User', userSchema);