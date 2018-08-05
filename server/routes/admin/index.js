const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');

const taskRoute = require('./task');
const testRoute = require('./test');

route.use((req, res, next) => (generalApi.isAdmin(req.user) ? next() : res.status(403).end()));

route.use('/task', taskRoute);
route.use('/test', testRoute);

route.get('/pending-teachers', (req, res) => {
  generalApi
    .getPendingTeachers(req.query.skip, req.query.top, 'email name surname account -__v')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(404).end();
    });
});

module.exports = route;
