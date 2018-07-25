const route = require('express').Router();
const taskApi = require('../../db-middleware/task-api');


route.get('/full-info/:taskId', (req, res) => {
  taskApi
    .getTaskById(
      req.params.taskId,
      '-successfulAttempts -attempts -__v',
      null,
      true,
    )
    .then((task) => {
      res.status(200).send(task);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/assign', (req, res) => {
  taskApi
    .assignTask(req.body)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.delete('/delete/:taskId', (req, res) => {
  taskApi
    .deleteTask(req.params.taskId)
    .then(() => {
      res.status(200).send(true);
    })
    .catch(() => {
      res.status(409).send(false);
    });
});

route.get('/abbreviated-info', (req, res) => {
  taskApi
    .getAllTasks(req.query.skip, req.query.top)
    .then((task) => {
      res.status(200).send(task);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = route;
