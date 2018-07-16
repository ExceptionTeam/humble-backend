const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db-initialization');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const taskApi = require('./server/db-middleware/task-api')(app, db);
const generalApi = require('./server/db-middleware/general-api')(app, db);
const { UserAssignment } = require('./server/models/user/user-assignment');
const { User, USER_ROLE_STUDENT } = require('./server/models/user/user');

app.get('/', (req, res) => {
  res.send('Hello from Artёm!');
});

app.get('/task/stud/full-info', (req, res) => {
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

app.get('/task/teach/students', (req, res) => {
  generalApi
    .getStudentsByTeacher(req.query.teachId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(404 /* 204 */).send(err);
    });
});

const server = app.listen(port, () => {
  console.log(`Server on port ${server.address().port}`);
});
