const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');

const taskRoute = require('./task');
const testRoute = require('./test');


// route.use((req, res, next) => (
//  (generalApi.isTeacher(req.user) || generalApi.isAdmin(req.user))
//    ? next() : res.status(403).end()));

route.use('/task', taskRoute);
route.use('/test', testRoute);


route.get('/students', (req, res) => {
  generalApi
    .getStudentsByTeacher(req.query.teacherId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.delete('/group/:groupId/remove/:studentId', (req, res) => {
  generalApi
    .removeStudentFromGroup(req.params.studentId, req.params.groupId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

module.exports = route;
