const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  authToken: String,
  authTokens: [String],
});

userSchema.statics.create = async function(userData) {
  const saltRounds = 10;
  const user = new this(userData);
  user.password = await bcrypt.hash(user.password, saltRounds);
  await user.generateAuthToken();
  await user.save();
  return user;
};

userSchema.methods.generateAuthToken = async function() {
  this.authToken = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  this.authTokens.push(this.authToken);
};

module.exports = mongoose.model('User', userSchema);