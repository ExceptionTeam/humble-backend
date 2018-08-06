const route = require('express').Router();
const testApi = require('../../db-middleware/test-api');

route.get('/all-submissions', (req, res) => {
  testApi
    .allSubmissions4Admin(req.query.skip, req.query.top)
    .then((submissions) => {
      res.status(200).send(submissions);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.use(require('../teacher/'));

module.exports = route;
