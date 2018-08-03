const route = require('express').Router();
const testApi = require('../../db-middleware/test-api');

route.get('/available-sections/:userId', (req, res) => {
  testApi
    .getAcceptableSectionsToRequest(req.params.userId)
    .then((sections) => {
      res.status(200).send(sections);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/new-request/:userid', (req, res) => {
  testApi
    .newTestRequest(req.params.userid, req.query.sectionid)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/tags', (req, res) => {
  testApi
    .getAllTags(req.query.sectionId, req.body)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = route;
