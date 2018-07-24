const route = require('express').Router();
const testApi = require('../../db-middleware/test-api');

route.get('/AvailableSections/:userId', (req, res) => {
  testApi
    .acceptableSectionsToRequest(req.params.userId)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(404).end();
    });
});

module.exports = route;
