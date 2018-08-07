const route = require('express').Router();
const testApi = require('../../db-middleware/test-api');

route.get('/all-submissions', (req, res) => {
  testApi
    .allSubmissionsForAdmin(req.query.skip, req.query.top)
    .then((submissions) => {
      res.status(200).send(submissions);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = route;
