const route = require('express').Router();
const taskApi = require('../../db-middleware/task-api');
const controller = require('../../controllers/storage-controller');
const Busboy = require('busboy');

const enqueueSubmission = require('../../../docker/api/index');

route.get('/full-info/:assignId', (req, res) => {
  taskApi
    .getAssignmentById(
      req.params.assignId,
      '-studentId -__v',
      'name description weight -_id',
      'name surname -_id',
    )
    .then((assignment) => {
      res.status(200).send(assignment);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.get('/tasks-list/:studentId', (req, res) => {
  taskApi
    .getAllStudentTasks(req.params.studentId)
    .then((task) => {
      res.status(200).send(task);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

route.get('/submissions/:assignId', (req, res) => {
  taskApi
    .getSubmissionsByAssignment(req.params.assignId, '-assignId', '-_id -__v')
    .then((submissions) => {
      res.status(200).send(submissions);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.post('/submit/:assignId', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  busboy.on('finish', () => {
    controller
      .createSubmission(req.files, req.params.assignId)
      .then((result) => {
        const submission = {
          _id: result.submissionId,
          assignId: req.params.assignId,
          srcFileId: result.fileId,
          submitTime: new Date().getTime(),
          tests: new Array(result.length).fill(null),
        };
        enqueueSubmission(submission);
        res.status(200).end();
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  });
  req.pipe(busboy);
});

route.get('/download/:submissionId', (req, res) => {
  controller
    .downloadSubmission(req.params.submissionId)
    .then((file) => {
      res.setHeader('Content-type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="solution.java');
      return file;
    })
    .then((file) => {
      file.pipe(res);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

module.exports = route;
