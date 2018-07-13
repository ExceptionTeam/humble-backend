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

app.get('/allTasks', (req, res) => {
  taskApi.getAllTasks()
    .then((task, error) => {
      if (error) res.status(404).send();
      if (!task.length) { res.status(204).send(); } else res.status(200).send(task);
    });
});

const server = app.listen(port, () => {
  console.log(`Server on port ${server.address().port}`);
});
