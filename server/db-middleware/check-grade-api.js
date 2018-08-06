const {
  TestAssignment,
  ASSIGNMENT_STATUS_PASSED,
  TYPE_PRIMARY_TEST,
  TYPE_TRAINING_TEST,
} = require('../models/testing/test-assignment');
const {
  TestSubmission,
  SUBMISSION_STATUS_PENDING,
  SUBMISSION_STATUS_ANSWERED,
} = require('../models/testing/test-submission');
const {
  Question,
  CATEGORY_SINGLE_ANSWER,
  CATEGORY_MULTIPLE_ANSWERS,
  CATEGORY_WORD_ANSWER,
  CATEGORY_SENTENCE_ANSWER,
  TYPE_TRAINING_QUESTION,
  TYPE_PRIMARY_QUESTION,
} = require('../models/testing/question');
const {
  TagAttachment,
} = require('../models/testing/tag-attachment');
const {
  CheckRequest,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_CHECKED,
} = require('../models/testing/check-request');
const generalApi = require('./general-api');

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

const isCheckingPossible = function (subId) {
  return CheckRequest
    .countDocuments({ status: REQUEST_STATUS_PENDING, submissionId: subId });
};

const checkSub = function (subId) {
  const answers = 2;
  // return TestSubmission
};

apiModule.initCheckingSequence = function (subId) {
  return isCheckingPossible(subId)
    .then((doCheck) => {
      if (doCheck) {
        checkSub(subId);
      } else return false;
    });
};

const initGraidingingSequence = function (assignmentId) {
  return isCheckingPossible();
};

module.exports = apiModule;
