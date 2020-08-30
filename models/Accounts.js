const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const AccountsSchema = new Schema({
  email: String,
  hash: String,
  salt: String,
});

AccountsSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

AccountsSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

AccountsSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  // set expiry to 60 days from now
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    expiresIn: parseInt(expirationDate.getTime() / 1000, 10),
    algorithm: 'HS256',

  }, process.env.JWT_SECRET);
}

AccountsSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

mongoose.model('Accounts', AccountsSchema);