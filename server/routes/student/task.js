const route = require('express').Router();
const multer = require('multer');
const taskApi = require('../../db-middleware/task-api');

const upload = multer();

route.get('/full-info/:assignId', (req, res) => {
  taskApi
    .getAssignmentById(
      req.params.assignId,
      '-_id -studentId -__v',
      'name description weight -_id',
      'name surname -_id',
    )
    .then((assignment) => {
      res.status(200).send(assignment);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/file-upload', upload.fields([]), (req, res) => {
  const formData = req.body;
  console.log('form data', formData);
  res.sendStatus(200);
});

route.get('/tasks-list/:studentId', (req, res) => {
  taskApi
    .getAllStudentTasks(req.params.studentId)
    .then((task) => {
      res.status(200).send(task);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send(err);
    });
});

route.get('/submissions/:assignId', (req, res) => {
  taskApi
    .getSubmissionsByAssignment(req.params.assignId, '-assignId', '-_id -__v')
    .then((submissions) => {
      res.status(200).send(submissions);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send(err);
    });
});

module.exports = route;
