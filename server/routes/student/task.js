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

route.get('/tasks-list/:id', (req, res) => {
  taskApi
    .getAllStudentTasks(req.params.id)
    .then((task) => {
      res.status(200).send(task);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = route;
