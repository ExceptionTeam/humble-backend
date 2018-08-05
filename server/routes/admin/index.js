const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');

const taskRoute = require('./task');
const testRoute = require('./test');

route.use((req, res, next) => (generalApi.isAdmin(req.user) ? next() : res.status(403).end()));

route.use('/task', taskRoute);
route.use('/test', testRoute);

route.post('/approve-teacher/:teacherId', (req, res) => {
  generalApi
    .updatePendingTeacher(req.params.teacherId, true)
    .then(() => {
      res.status(200).end();
    })
    .catch(() => {
      res.status(400).end();
    });
});

route.post('/reject-teacher/:teacherId', (req, res) => {
  generalApi
    .updatePendingTeacher(req.params.teacherId, false)
    .then(() => {
      res.status(200).end();
    })
    .catch(() => {
      res.status(400).end();
    });
});

module.exports = route;
