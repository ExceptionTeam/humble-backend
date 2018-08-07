const route = require('express').Router();
const passport = require('passport');
const generalApi = require('../db-middleware/general-api');

route.use((req, res, next) => {
  if (req.isUnauthenticated()) {
    next();
  } else {
    res.status(403).send();
  }
});

route.use('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (user) {
      req.login(user, error => (error ?
        res.status(400).end() :
        res.json({
          id: user._id,
          name: user.name,
          surname: user.surname,
          role: user.role,
          email: user.email,
        })));
    } else {
      return res.status(400).json(err);
    }
  })(req, res, next);
});

route.post('/register', (req, res) => {
  (req.body.isStudent ? generalApi.addNewStudent : generalApi.addNewTeacher)({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    primarySkill: req.body.primarySkill,
    account: req.body.account,
  })
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

route.post('/reset-password', (req, res) => {
  generalApi
    .resetPassword(req.body.email)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

route.post('/university', (req, res) => {
  generalApi.getUniversity(req.body.filterConfig)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

module.exports = route;
