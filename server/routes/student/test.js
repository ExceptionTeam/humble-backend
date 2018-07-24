const route = require('express').Router();
const testApi = require('../../db-middleware/test-api');

route.get('/AvailableSections/:userId', (req, res) => {
  testApi
    .acceptableSectionsToRequest(req.params.userId)
    .then((sections) => {
      res.status(200).send(sections);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = route;
