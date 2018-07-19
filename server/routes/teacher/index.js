const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');

const taskRoute = require('./task');
const testRoute = require('./test');

route.use('/task', taskRoute);
route.use('/test', testRoute);


route.get('/students', (req, res) => {
  generalApi
    .getStudentsByTeacher(req.query.teacherId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(404 /* 204 */).send(err);
    });
});

module.exports = route;