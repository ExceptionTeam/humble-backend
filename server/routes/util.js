const route = require('express').Router();

const generalApi = require('../db-middleware/general-api');

route.use('/email-check/:email', (req, res) => {
  generalApi
    .checkEmail(req.params.email)
    .then((exists) => {
      res.status(200).send(exists);
    })
    .catch(() => {
      res.status(400).end();
    });
});

module.exports = route;

