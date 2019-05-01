const passport = require('passport');
const User     = require('../models/user');

passport.serializeUser((userObj, done) => {
  done(null, userObj._id);
});
  
passport.deserializeUser((idFromCookie, done) => {
User.findById(idFromCookie)
  .then((userObj) => done(null, userObj))           // null = NO ERRORS OCCURRED, userObj = `req.user`
  .catch((err) => done(err));                       // err as the first argument means we tell Passport there was an error
});

module.exports = passport;