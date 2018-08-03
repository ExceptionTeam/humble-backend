const route = require('express').Router();
const generalApi = require('../db-middleware/general-api');
const taskApi = require('../db-middleware/task-api');

const guestRoute = require('./guest');
const studentRoute = require('./student');
const teacherRoute = require('./teacher');
const adminRoute = require('./admin');

route.use('/guest', guestRoute);

route.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send();
  }
});

route.use('/student', studentRoute);
route.use('/teacher', teacherRoute);
route.use('/admin', adminRoute);

route.post('/activate/:taskId', (req, res) => {
  taskApi
    .activateTask(req.params.taskId)
    .then(() => {
      res.status(200).end();
    })
    .catch(() => {
      res.status(404).end();
    });
});

route.use('/info', (req, res) => {
  res.status(200).send({
    id: req.user.id,
    role: req.user.role,
    name: req.user.name,
    surname: req.user.surname,
  });
});

route.use('/logout', (req, res) => {
  req.logout();
  res.status(200).end();
});

route.post('/change-password', (req, res) => {
  generalApi
    .changePassword(req.user.id, req.body.oldPass, req.body.newPass)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

module.exports = route;
