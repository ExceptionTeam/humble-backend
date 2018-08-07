const route = require('express').Router();
const taskApi = require('../../db-middleware/task-api');


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
      res.status(404).json(err);
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
      res.status(404).json(err);
    });
});

route.use(require('../teacher/'));

module.exports = route;
