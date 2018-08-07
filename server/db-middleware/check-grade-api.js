const {
  TestAssignment,
} = require('../models/testing/test-assignment');
const {
  TestSubmission,
} = require('../models/testing/test-submission');
const {
  CATEGORY_WORD_ANSWER,
  CATEGORY_SENTENCE_ANSWER,
} = require('../models/testing/question');
const {
  CheckRequest,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_CHECKED,
} = require('../models/testing/check-request');
const generalApi = require('./general-api');
const submissionApi = require('./submission-api');

const apiModule = {};


const isGraidingPossibleIndividual = function (assignment) {
  return CheckRequest
    .countDocuments({ assignmentId: assignment._id, status: REQUEST_STATUS_CHECKED })
    .then((amount) => {
      if (amount ||
        (assignment.deadline !== null && assignment.deadline < new Date().getTime())
      ) return true;
      return false;
    });
};

const isGraidingPossibleGroup = function (assignment) {
  let stdAmount;
  return generalApi.getStudentsByGroup(assignment.groupId)
    .then((std) => {
      stdAmount = std.length;
    })
    .then(() => TestSubmission
      .countDocuments({ assignmentId: assignment._id, status: REQUEST_STATUS_CHECKED }))
    .then((submissionAmount) => {
      if (stdAmount === submissionAmount ||
        (assignment.deadline !== null && assignment.deadline < new Date().getTime())
      ) return true;
      return false;
    });
};

apiModule.isGraidingPossible = function (assignmentId) {
  return TestAssignment
    .findById(assignmentId)
    .then((assignment) => {
      if (assignment.groupId === undefined) {
        return isGraidingPossibleIndividual(assignment);
      } return isGraidingPossibleGroup(assignment);
    });
};


module.exports = apiModule;
