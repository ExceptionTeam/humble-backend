const route = require('express').Router();
const multer = require('multer');
const taskApi = require('../../db-middleware/task-api');

const upload = multer();

route.get('/full-info', (req, res) => {
  taskApi
    .getAssignmentById(
      req.query.assId,
      '-_id -studentId -__v',
      'name description weight -_id',
      'name surname -_id',
    )
    .then((assignment) => {
      res.status(200).send(assignment);
    })
    .catch((err) => {
      res.status(404 /* 204 */).send(err);
    });
});

route.post('/fileUpload', upload.fields([]), (req, res) => {
  const formData = req.body;
  console.log('form data', formData);
  res.sendStatus(200);
});

route.get('/tasks-list', (req, res) => {
  taskApi.getAllStudentTasks(req.query.id)
    .then((task, error) => {
      if (error) {
        res.status(404).send();
      }
      res.status(200).send(task);
    });
});

module.exports = route;
