const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');
const testApi = require('../../db-middleware/test-api');

route.get('/get-students/:teacherId', (req, res) => {
  generalApi
    .getStudentsByTeacherFlat(req.params.teacherId)
    .then((studId) => {
      res.status(200).send(studId);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.get('/pending-requests/:teacherId', (req, res) => {
  testApi
    .getPendingRequestsByTeacher(req.params.teacherId)
    .then((requests) => {
      res.status(200).send(requests);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = route;
