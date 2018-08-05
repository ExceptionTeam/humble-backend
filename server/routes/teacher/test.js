const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');
const testApi = require('../../db-middleware/test-api');
const submissionApi = require('../../db-middleware/submission-api');

route.post('/approve/:requestId/:teacherId', (req, res) => {
  testApi
    .approveRequest(req.params.requestId, req.params.teacherId)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.get('/get-students/:teacherId', (req, res) => {
  generalApi
    .getStudentsByTeacher(req.params.teacherId)
    .then((studId) => {
      res.status(200).send(studId);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/reject/:requestId', (req, res) => {
  testApi
    .rejectRequest(req.params.requestId)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.get('/pending-requests/:teacherId', (req, res) => {
  testApi
    .getPendingRequestsByTeacher(req.params.teacherId)
    .then((requests) => {
      res.status(200).send(requests);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/tag-questions/', (req, res) => {
  submissionApi
    .getQuestionsByTags(req.body.tags)
    .then((submission) => {
      res.status(200).send(submission);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.get('/tags/', (req, res) => {
  submissionApi
    .getAllTagAttachments()
    .then((tags) => {
      res.status(200).send(tags);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post('/new-question/', (req, res) => {
  testApi
    .newQuestion(req.body)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.get('/questions-check/:teacherId', (req, res) => {
  submissionApi
    .getQuestionsToCheck(req.params.teacherId)
    .then((questions) => {
      res.status(200).send(questions);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.get('/check-res/:checkid/:result', (req, res) => {
  submissionApi
    .sendCheckingResults(req.params.checkid, req.params.result)
    .then((questions) => {
      res.status(200).send(questions);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = route;
