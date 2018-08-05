const route = require('express').Router();
const testApi = require('../../db-middleware/test-api');
const submissionApi = require('../../db-middleware/submission-api');

route.get('/available-sections/:userId', (req, res) => {
  testApi
    .getAcceptableSectionsToRequest(req.params.userId, req.query.skip, req.query.top)
    .then((sections) => {
      res.status(200).send(sections);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.post('/new-request/:userid', (req, res) => {
  testApi
    .newTestRequest(req.params.userid, req.query.sectionid)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.get('/submission/:assignmentId/:studentId', (req, res) => {
  submissionApi
    .makeTestSubmission(req.params.assignmentId, req.params.studentId)
    .then((submission) => {
      res.status(200).send(submission);
    })
    .catch((err) => {
      if (err.message === 'Not enough questions') {
        res.status(404).send(err.message);
      } else res.status(404).json(err);
    });
});

route.get('/assignments/:studentId', (req, res) => {
  testApi
    .getStudAllAssignments(req.params.studentId, req.query.skip, req.query.top)
    .then((assignments) => {
      res.status(200).send(assignments);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.post('/answers/:assignmentId', (req, res) => {
  submissionApi
    .getQuestionsAndUpdateSubmition(req.params.assignmentId, req.body)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

module.exports = route;
