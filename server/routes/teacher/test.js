const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');


route.get('/get-students/:teacherId', (req, res) => {
  generalApi
    .getFilteredStudentsByTeacher(req.params.teacherId)
    .then((studId) => {
      res.status(200).send(studId);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = route;
