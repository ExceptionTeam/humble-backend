const route = require('express').Router();
const generalApi = require('../db-middleware/general-api');

const guestRoute = require('./guest');
const studentRoute = require('./student');
const teacherRoute = require('./teacher');
const adminRoute = require('./admin');

route.use('/guest', guestRoute);

// route.use((req, res, next) => {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.status(401).send();
//   }
// });

route.use('/student', studentRoute);
route.use('/teacher', teacherRoute);
route.use('/admin', adminRoute);

route.use('/logout', (req, res) => {
  req.logout();
  res.status(200).end();
});

route.post('/reset-password', (req, res) => {
  generalApi
    .resetPassword(req.user.id)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

route.post('/change-password/:userId/:password', (req, res) => {
  generalApi
    .changePassword(req.params.userId, req.params.password)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

module.exports = route;
