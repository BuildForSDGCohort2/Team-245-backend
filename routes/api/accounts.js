
const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Accounts = mongoose.model('Accounts');

//POST new account route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  const { body: { account } } = req;

  if(!account.email) {
    res.status = 422;
    return res.json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!account.password) {
    res.status = 422;
    return res.json({
      errors: {
        password: 'is required',
      },
    });
  }

  const finalAccount = new Accounts(account);

  finalAccount.setPassword(account.password);

  return finalAccount.save()
    .then(() => res.json({ account: finalAccount.toAuthJSON() }));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { account } } = req;

  if(!account.email) {
    res.status = 422;
    return res.json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!account.password) {
    res.status = 422;
    return res.json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const account = passportUser;
      account.token = passportUser.generateJWT();

      return res.json({ account: account.toAuthJSON() });
    }
    res.status = 400;
    return res.json({errors: {server: info}});
  })(req, res, next);
});

//GET current route (required, only authenticated accounts have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;
  return Accounts.findById(id)
    .then((account) => {
      if(!account) {
        return res.sendStatus(400);
      }

      return res.json({ account: account.toAuthJSON() });
    });
});

module.exports = router;