const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db-initialization');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const taskApi = require('./server/db-middleware/task-api')(app, db);

app.get('/', (req, res) => {
  res.send('Hello from Artёm!');
});

app.get('/task/full-info-stud', (req, res) => {
  taskApi
    .getAssignmentById(req.query.assId)
    .then((assignment) => {
      res.status(200).send(assignment);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

const server = app.listen(port, () => {
  console.log(`Server on port ${server.address().port}`);
});
