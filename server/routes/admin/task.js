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

module.exports = route;
