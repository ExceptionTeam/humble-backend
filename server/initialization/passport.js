const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/user/user');

passport.use(new LocalStrategy(((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    if (!user.verifyPassword(password)) { return done(null, false); }
    return done(null, user);
  });
})));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
