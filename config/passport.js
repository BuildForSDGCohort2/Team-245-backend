const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Accounts = mongoose.model('Accounts');

passport.use(new LocalStrategy({
  usernameField: 'account[email]',
  passwordField: 'account[password]',
}, (email, password, done) => {
  Accounts.findOne({ email })
    .then((account) => {
      if(!account || !account.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }

      return done(null, account);
    }).catch(done);
}))