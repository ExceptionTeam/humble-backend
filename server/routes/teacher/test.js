const route = require('express').Router();
const teskApi = require('../../db-middleware/test-api');


route.post('/approve/:requestid', (req, res) => {
  teskApi
    .approveRequest(req.params.requestid)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/reject/:requestid', (req, res) => {
  teskApi
    .rejectRequest(req.params.requestid)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = route;
