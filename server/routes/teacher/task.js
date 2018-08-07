const route = require('express').Router();
const taskApi = require('../../db-middleware/task-api');
const controller = require('../../controllers/storage-controller');
const Busboy = require('busboy');

route.post('/activate/:taskId', (req, res) => {
  taskApi
    .activateTask(req.params.taskId)
    .then(() => {
      res.status(200).end();
    })
    .catch(() => {
      res.status(404).end();
    });
});

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
      res.status(404).json(err);
    });
});

route.post('/assign', (req, res) => {
  taskApi
    .assignTask(req.body)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(404).json(err);
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
      res.status(404).json(err);
    });
});

route.post('/upload-task', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  busboy.on('finish', () => {
    controller.createTask(req.files, req.body, req.query.length)
      .then(() => res.status(200).end())
      .catch((err) => {
        res.status(404).json(err);
      });
  });
  req.pipe(busboy);
});

route.post('/edit-task/:taskId/:length', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  busboy.on('finish', () => {
    controller.editTask(req.files, req.body, req.params.taskId, req.params.length)
      .then(() => res.status(200).end())
      .catch((err) => {
        res.status(404).json(err);
      });
  });
  req.pipe(busboy);
});

route.use(require('../student/'));

module.exports = route;
