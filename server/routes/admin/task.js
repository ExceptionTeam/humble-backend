const route = require('express').Router();
const taskApi = require('../../db-middleware/task-api');

route.post('/activate/:taskId', (req, res) => {
  taskApi
    .activateTask(req.params.taskId)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(404).end();
    });
});

route.post('/abbreviated-info', (req, res) => {
  taskApi
    .getAllTasks(
      req.query.skip,
      req.query.top,
      '-inputFilesId -outputFilesId -tags -successfulAttempts -attempts -description -__v',
      req.body,
      false,
    )
    .then((task) => {
      res.status(200).send(task);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.get('/full-info/:taskId', (req, res) => {
  taskApi
    .getTaskById(
      req.params.taskId,
      '-__v',
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

module.exports = route;
