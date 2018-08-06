const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');

const taskRoute = require('./task');
const testRoute = require('./test');

// route.use((req, res, next) => (generalApi.isAdmin(req.user) ? next() : res.status(403).end()));

route.use('/task', taskRoute);
route.use('/test', testRoute);


route.get('/pending-teachers', (req, res) => {
  generalApi
    .getPendingTeachers(req.query.skip, req.query.top, '-hash -salt -primarySkill -role -__v')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(404).end();
    });
});

route.post('/info/:category', (req, res) => {
  generalApi
    .getPersonsCategorized(
      req.params.category,
      req.query.skip,
      req.query.top,
      req.body.filterConfig,
    )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404).end();
    });
});

module.exports = route;
