const route = require('express').Router();
const taskApi = require('../../db-middleware/task-api');
const fileApi = require('../../aws-middleware/file-api');
const Busboy = require('busboy');


route.get('/full-info/:taskId', (req, res) => {
  taskApi
    .getTaskById(
      req.params.taskId,
      '-successfulAttempts -attempts -__v -active',
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
    .catch((err) => {
      res.status(409).send(false);
    });
});

route.post('/abbreviated-info', (req, res) => {
  taskApi
    .getAllTasks(
      req.query.skip,
      req.query.top,
      '-inputFilesId -outputFilesId -tags -successfulAttempts -attempts -description -__v -active',
      req.body,
    )
    .then((task) => {
      res.status(200).send(task);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/upload-task', (req, res, next) => {
  const busboy = new Busboy({ headers: req.headers });
  busboy.on('finish', () => {
    try {
      fileApi.createTask(req.files, req.body, req.query.length);
      res.status(200).end();
    } catch (err) {
      res.status(404).end();
    }
  });
  req.pipe(busboy);
});


module.exports = route;
