const route = require('express').Router();
const taskApi = require('../../db-middleware/task-api');


route.get('/full-info', (req, res) => {
  taskApi
    .getTaskById(
      req.query.taskId,
      '-successfulAttempts -attempts -__v',
    )
    .then((task) => {
      res.status(200).send(task);
    })
    .catch((err) => {
      res.status(404 /* 204 */).send(err);
    });
});

route.post('/assign', (req, res) => {
  taskApi
    .assignTask(req.body)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(404 /* 204 */).end();
    });
});

route.get('/abbreviated-info', (req, res) => {
  taskApi.getAllTasks()
    .then((task, error) => {
      if (error) {
        res.status(404).send();
      } else if (!task.length) {
        res.status(204).send();
      } else res.status(200).send(task);
    });
});

module.exports = route;
