const route = require('express').Router();
const testApi = require('../../db-middleware/test-api');

route.get('/available-sections/:userId', (req, res) => {
  testApi
    .acceptableSectionsToRequest(req.params.userId)
    .then((sections) => {
      res.status(200).send(sections);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/new-request/:userid', (req, res) => {
  testApi
    .newTestRequest(req.params.userid)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/new-request/:userid/:sectionid', (req, res) => {
  testApi
    .newTestRequest(req.params.userid, req.params.sectionid)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = route;
