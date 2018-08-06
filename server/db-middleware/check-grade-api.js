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

const isCheckingPossible = function (subId) {
  return CheckRequest
    .countDocuments({ status: REQUEST_STATUS_PENDING, submissionId: subId });
};

const checkSub = function (subId) {
  let submiss = {};
  return TestSubmission
    .findById(subId)
    .populate('questionsId', 'correctOptions category')
    .then((submission) => {
      submiss = submission;
    })
    .then(() => {
      const checkIfRight = function (ans, quest) {
        if (
          quest._id === ans.questionId && quest.category !== CATEGORY_SENTENCE_ANSWER &&
          ((quest.category === CATEGORY_WORD_ANSWER && ans.answ === quest.question) ||
          (ans.answ.every((el, index) => {
            if (el === quest.answ[index]) return true;
            return false;
          })))) return true;
        return false;
      };
      submiss.answers.forEach((ans, index) => {
        if (submiss.questionId.some(quest => checkIfRight(ans, quest))) {
          submiss.answers[index].result = true;
        } else submiss.answers[index].result = false;
      });
      submissionApi.getAnswersAndUpdateSubmition();
    });
};

apiModule.initCheckingSequence = function (subId) {
  return isCheckingPossible(subId)
    .then((doCheck) => {
      if (doCheck) {
        checkSub(subId);
      } else return false;
    });
};

// checkSub('5b68568f40b4a92ae09af3ab');

const initGraidingingSequence = function (assignmentId) {
  return isCheckingPossible();
};

module.exports = apiModule;
