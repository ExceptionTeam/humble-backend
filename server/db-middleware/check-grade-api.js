const {
  TestAssignment,
} = require('../models/testing/test-assignment');
const {
  TestSubmission,
  SUBMISSION_STATUS_EVALUATED,
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
  CheckRequest,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_CHECKED,
} = require('../models/testing/check-request');
const generalApi = require('./general-api');

const minToChangeMark = 20;

const apiModule = {};


const isGraidingPossibleIndividual = function (assignment) {
  return CheckRequest
    .countDocuments({ assignmentId: assignment._id, status: REQUEST_STATUS_PENDING })
    .then((amount) => {
      if (!amount ||
        (assignment.deadline !== null && assignment.deadline < new Date().getTime())
      ) return true;
      return false;
    });
};

const isGraidingPossibleGroup = function (assignment) {
  let stdAmount;
  let requestAmount;
  return TestAssignment
    .findById(assignment._id)
    .then(assign => generalApi.getStudentsByGroup(assign.groupId))
    .then((std) => {
      stdAmount = std.length;
      return CheckRequest
        .countDocuments({ assignmentId: assignment._id, status: REQUEST_STATUS_PENDING });
    })
    .then((check) => {
      requestAmount = !check;
    })
    .then(() => TestSubmission
      .countDocuments({ assignmentId: assignment._id, status: REQUEST_STATUS_CHECKED }))
    .then((submissionAmount) => {
      if ((stdAmount === submissionAmount && requestAmount) ||
        (assignment.deadline !== undefined && assignment.deadline < new Date().getTime())
      ) return true;
      return false;
    });
};

const updateQuestion = function (questId) {
  return Question
    .findById(questId)
    .select('peopleTested peopleAnswered difficulty')
    .then((info) => {
      let diff;
      if (+info.peopleTested !== 0) {
        diff = info.peopleTested - info.peopleAnswered;
        diff /= +info.peopleTested;
        diff *= 4;
        diff = Math.round(0.5 + diff);
        if (diff > 4) diff = 4;
        else if (diff < 1) diff = 1;
      }
      if ((+info.peopleTested > minToChangeMark) &&
      (diff !== +info.difficulty)) {
        return Question
          .findByIdAndUpdate(questId, { $set: { difficulty: diff } });
      } return true;
    });
};

apiModule.initGraidingSequence = function (assignId) {
  let assignToRemember;
  return TestAssignment
    .findById(assignId)
    .then((assignment) => {
      assignToRemember = assignment;
      if (assignment.groupId === undefined) {
        return isGraidingPossibleIndividual(assignId)
          .then((shouldIGrade) => {
            if (shouldIGrade) {
              return Question
                .find({ tags: { $in: assignToRemember.tags } })
                .select('_id')
                .then(questionsToUpdate =>
                  Promise.all(questionsToUpdate.map(el => updateQuestion(el._id))))
                .then(() => TestSubmission
                  .find({ assignmentId: assignId })
                  .select('_id'))
                .then(sub => apiModule.gradingSequence(sub[0]._id));
            }
          });
      }
      return isGraidingPossibleGroup(assignId)
        .then((shouldIGrade) => {
          if (shouldIGrade) {
            return Question
              .find({ tags: { $in: assignToRemember.tags } })
              .select('_id')
              .then(questionsToUpdate =>
                Promise.all(questionsToUpdate.map(el => updateQuestion(el._id))))
              .then(() => TestSubmission
                .find({ assignmentId: assignId })
                .select('_id'))
              .then(sub =>
                Promise.all(sub.map(el => apiModule.gradingSequence(el._id))));
          } return false;
        });
    });
};

apiModule.gradingSequence = function (subId) {
  return TestSubmission
    .findById(subId)
    .populate('questionsId', 'peopleTested peopleAnswered difficulty')
    .then(sub => Promise.all(sub.questionsId.map((el, index) => {
      let diff;
      if (el.peopleTested <= minToChangeMark) {
        diff = el.difficulty;
      } else if (el.peopleTested > 0) {
        diff = el.peopleTested - el.peopleAnswered;
        diff /= el.peopleTested;
        diff *= 4;
        diff += 0.5;
        if (diff > 4.5) diff = 4.5;
        else if (diff < 0.5) diff = 0.5;
      }
      const toGiveBack = {
        difficulty: diff,
        result: sub.answers[index].result,
      };
      return toGiveBack;
    })))
    .then((answers) => {
      function compareDiff(a, b) {
        if (a.difficulty >= b.difficulty) return 1;
        return -1;
      }
      return answers.sort(compareDiff);
    })
    .then((answers) => {
      const amount = answers.length;
      const easy = Math.floor(amount * 0.4) + 1;
      let easyPart = 4 * answers.reduce((sum, current, i) => {
        if (i < easy && current.result) return sum + current.difficulty;
        return sum;
      }, 0);
      easyPart /= answers.reduce((sum, current, i) => {
        if (i < easy) return sum + current.difficulty;
        return sum;
      }, 0);
      let hardPart = 6 * answers.reduce((sum, current, i) => {
        if (i >= easy && current.result) return sum + current.difficulty;
        return sum;
      }, 0);
      hardPart /= answers.reduce((sum, current, i) => {
        if (i >= easy) return sum + current.difficulty;
        return sum;
      }, 0);
      return Math.round(hardPart + easyPart);
    })
    .then(result => TestSubmission
      .findByIdAndUpdate(subId, { $set: { mark: result, status: SUBMISSION_STATUS_EVALUATED } }));
};

module.exports = apiModule;
