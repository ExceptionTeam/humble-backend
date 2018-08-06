const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');

const taskRoute = require('./task');
const testRoute = require('./test');

route.use('/task', taskRoute);
route.use('/test', testRoute);

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
