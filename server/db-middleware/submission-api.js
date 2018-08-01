const {
  TestAssignment,
  ASSIGNMENT_STATUS_PASSED,
} = require('../models/testing/test-assignment');
const {
  TestSubmission,
  SUBMISSION_STATUS_PENDING,
} = require('../models/testing/test-submission');
const {
  Question,
  CATEGORY_SINGLE_ANSWER,
  CATEGORY_MULTIPLE_ANSWERS,
  CATEGORY_WORD_ANSWER,
  CATEGORY_SENTENCE_ANSWER,
} = require('../models/testing/question');

const averageDiff = 2.5;

const apiModule = {};

apiModule.getQuestionsByTags = function (questionTags) {
  return Question
    .find({
      tags: { $in: questionTags },
    });
};

apiModule.getQuestionsAndSort = function (questionTags, questionType) {
  const questions = {};
  questions.d1c1 = []; questions.d1c2 = []; questions.d1c3 = [];
  questions.d2c1 = []; questions.d2c2 = []; questions.d2c3 = [];
  questions.d3c1 = []; questions.d3c2 = []; questions.d3c3 = [];
  questions.d4c1 = []; questions.d4c2 = []; questions.d4c3 = [];
  return Question
    .find({
      tags: { $in: questionTags }, active: true, type: questionType,
    })
    .select('_id difficulty category')
    .then((questionsUnsorted) => {
      const compareRandom = function (a, b) {
        return Math.random() - 0.5;
      };
      return questionsUnsorted.sort(compareRandom);
    })
    .then((questionsUnsorted) => {
      questionsUnsorted.forEach((el) => {
        if (el.difficulty === 1 && el.category === CATEGORY_SINGLE_ANSWER) {
          questions.d1c1.push(el._id);
        } else if (el.difficulty === 1 && el.category === CATEGORY_MULTIPLE_ANSWERS) {
          questions.d1c2.push(el._id);
        } else if (el.difficulty === 1 && el.category === CATEGORY_WORD_ANSWER) {
          questions.d1c3.push(el._id);
        } else if (el.difficulty === 2 && el.category === CATEGORY_SINGLE_ANSWER) {
          questions.d2c1.push(el._id);
        } else if (el.difficulty === 2 && el.category === CATEGORY_MULTIPLE_ANSWERS) {
          questions.d2c2.push(el._id);
        } else if (el.difficulty === 2 && el.category === CATEGORY_WORD_ANSWER) {
          questions.d2c3.push(el._id);
        } else if (el.difficulty === 3 && el.category === CATEGORY_SINGLE_ANSWER) {
          questions.d3c1.push(el._id);
        } else if (el.difficulty === 3 && el.category === CATEGORY_MULTIPLE_ANSWERS) {
          questions.d3c2.push(el._id);
        } else if (el.difficulty === 3 && el.category === CATEGORY_WORD_ANSWER) {
          questions.d3c3.push(el._id);
        } else if (el.difficulty === 4 && el.category === CATEGORY_SINGLE_ANSWER) {
          questions.d4c1.push(el._id);
        } else if (el.difficulty === 4 && el.category === CATEGORY_MULTIPLE_ANSWERS) {
          questions.d4c2.push(el._id);
        } else if (el.difficulty === 4 && el.category === CATEGORY_WORD_ANSWER) {
          questions.d4c3.push(el._id);
        }
      });
    })
    .then(() => questions);
};

const getCaseNumber = function (caseAvailable, byDifficulty, byCat, diffBool, catBool) {
  let caseNumber = -1;

  const checkConditions = function (diff, cat, caseNum) {
    if (
      ((byCat[cat] <= byCat[0]) || !catBool[0]) &&
      ((byCat[cat] <= byCat[1]) || !catBool[1]) &&
      ((byCat[cat] <= byCat[2]) || !catBool[2]) &&
      ((byDifficulty[diff] <= byDifficulty[0]) || !diffBool[0]) &&
      ((byDifficulty[diff] <= byDifficulty[1]) || !diffBool[1]) &&
      ((byDifficulty[diff] <= byDifficulty[2]) || !diffBool[2]) &&
      ((byDifficulty[diff] <= byDifficulty[3]) || !diffBool[3]) &&
      caseAvailable[caseNum - 1]) return true;
    return false;
  };

  if (checkConditions(0, 0, 1)) caseNumber = 1;
  else if (checkConditions(0, 1, 2)) caseNumber = 2;
  else if (checkConditions(0, 2, 3)) caseNumber = 3;
  else if (checkConditions(1, 0, 4)) caseNumber = 4;
  else if (checkConditions(1, 1, 5)) caseNumber = 5;
  else if (checkConditions(1, 2, 6)) caseNumber = 6;
  else if (checkConditions(2, 0, 7)) caseNumber = 7;
  else if (checkConditions(2, 1, 8)) caseNumber = 8;
  else if (checkConditions(2, 2, 9)) caseNumber = 9;
  else if (checkConditions(3, 0, 10)) caseNumber = 10;
  else if (checkConditions(3, 1, 11)) caseNumber = 11;
  else if (checkConditions(3, 2, 12)) caseNumber = 12;

  else if (caseAvailable[11]) caseNumber = 12;
  else if (caseAvailable[10]) caseNumber = 11;
  else if (caseAvailable[9]) caseNumber = 10;
  else if (caseAvailable[8]) caseNumber = 9;
  else if (caseAvailable[7]) caseNumber = 8;
  else if (caseAvailable[6]) caseNumber = 7;
  else if (caseAvailable[5]) caseNumber = 6;
  else if (caseAvailable[4]) caseNumber = 5;
  else if (caseAvailable[3]) caseNumber = 4;
  else if (caseAvailable[2]) caseNumber = 3;
  else if (caseAvailable[1]) caseNumber = 2;
  else if (caseAvailable[0]) caseNumber = 1;

  return caseNumber;
};

apiModule.getQuestionsToSubmit = function (questionTags, questionType, questionAmount) {
  const amountByDiff = [0, 0, 0, 0];
  const amountByCat = [0, 0, 0];
  const questionIdToSubmit = [];
  let ballsLeft = averageDiff * questionAmount;
  let flag = true;
  let completed = false;
  const caseAvailable =
  [true, true, true, true, true, true, true, true, true, true, true, true];
  const diffBool = [true, true, true, true];
  const catBool = [true, true, true];

  const checkIfAvailable = function () {
    if (!(caseAvailable[0] && caseAvailable[1]
      && caseAvailable[2])) diffBool[0] = false;
    else if (!(caseAvailable[3] && caseAvailable[4]
      && caseAvailable[5])) diffBool[1] = false;
    else if (!(caseAvailable[6] && caseAvailable[7]
      && caseAvailable[8])) diffBool[2] = false;
    else if (!(caseAvailable[9] && caseAvailable[10]
      && caseAvailable[11])) diffBool[3] = false;
    if (!(caseAvailable[0] && caseAvailable[3]
      && caseAvailable[6] && caseAvailable[9])) catBool[0] = false;
    else if (!(caseAvailable[1] && caseAvailable[4]
      && caseAvailable[7] && caseAvailable[10])) catBool[1] = false;
    else if (!(caseAvailable[2] && caseAvailable[5]
      && caseAvailable[8] && caseAvailable[11])) catBool[2] = false;
  };

  let caseNumber;
  let availableQuestions;
  return Question.find({
    tags: { $in: questionTags },
    active: true,
    category: CATEGORY_SENTENCE_ANSWER,
    type: questionType,
  })
    .select('_id category difficulty')
    .then(toChoose => toChoose[Math.floor(Math.random() * toChoose.length)])
    .then((buffer) => {
      if (buffer != null) {
        questionIdToSubmit.push(buffer._id);
        amountByDiff[buffer.difficulty - 1]++;
        ballsLeft -= buffer.difficulty;
      }
    })
    .then(() => {
      availableQuestions = apiModule.getQuestionsAndSort(questionTags, questionType);
      return availableQuestions;
    })
    .then((keys) => {
      availableQuestions = keys;
    })
    .then(() => Object.keys(availableQuestions))
    .then((keys) => {
      keys.forEach((key, index) => {
        if (availableQuestions[key].length === 0) {
          caseAvailable[index] = false;
        }
      });
    })
    .then(() => {
      checkIfAvailable();
    })
    .then(() => {
      while (flag) {
        caseNumber = getCaseNumber(caseAvailable, amountByDiff, amountByCat, diffBool, catBool);
        if (ballsLeft < 0) {
          flag = false;
          completed = true;
        } else if (caseNumber === -1) {
          flag = false;
        } else {
          switch (caseNumber) {
            case 1: {
              questionIdToSubmit.push(availableQuestions.d1c1[availableQuestions.d1c1.length - 1]);
              availableQuestions.d1c1.pop();
              amountByDiff[0]++; amountByCat[0]++; ballsLeft -= 1;
              if (availableQuestions.d1c1.length === 0) {
                caseAvailable[0] = false;
                checkIfAvailable();
              }
              break;
            } case 2: {
              questionIdToSubmit.push(availableQuestions.d1c2[availableQuestions.d1c2.length - 1]);
              availableQuestions.d1c2.pop();
              (amountByDiff[0])++; amountByCat[1]++; ballsLeft -= 1;
              if (availableQuestions.d1c2.length === 0) {
                caseAvailable[1] = false;
                checkIfAvailable();
              }
              break;
            } case 3: {
              questionIdToSubmit.push(availableQuestions.d1c3[availableQuestions.d1c3.length - 1]);
              availableQuestions.d1c3.pop();
              (amountByDiff[0])++; (amountByCat[2])++; ballsLeft -= 1;
              if (availableQuestions.d1c3.length === 0) {
                caseAvailable[2] = false;
                checkIfAvailable();
              }
              break;
            } case 4: {
              questionIdToSubmit.push(availableQuestions.d2c1[availableQuestions.d2c1.length - 1]);
              availableQuestions.d2c1.pop();
              amountByDiff[1]++; amountByCat[0]++; ballsLeft -= 2;
              if (availableQuestions.d2c1.length === 0) {
                caseAvailable[3] = false;
                checkIfAvailable();
              }
              break;
            } case 5: {
              questionIdToSubmit.push(availableQuestions.d2c2[availableQuestions.d2c2.length - 1]);
              availableQuestions.d2c2.pop();
              amountByDiff[1]++; amountByCat[1]++; ballsLeft -= 2;
              if (availableQuestions.d2c2.length === 0) {
                caseAvailable[4] = false;
                checkIfAvailable();
              }
              break;
            } case 6: {
              questionIdToSubmit.push(availableQuestions.d2c3[availableQuestions.d2c3.length - 1]);
              availableQuestions.d2c3.pop();
              amountByDiff[1]++; amountByCat[2]++; ballsLeft -= 2;
              if (availableQuestions.d2c3.length === 0) {
                caseAvailable[5] = false;
                checkIfAvailable();
              }
              break;
            } case 7: {
              questionIdToSubmit.push(availableQuestions.d3c1[availableQuestions.d3c1.length - 1]);
              availableQuestions.d3c1.pop();
              amountByDiff[2]++; amountByCat[0]++; ballsLeft -= 3;
              if (availableQuestions.d3c1.length === 0) {
                caseAvailable[6] = false;
                checkIfAvailable();
              }
              break;
            } case 8: {
              questionIdToSubmit.push(availableQuestions.d3c2[availableQuestions.d3c2.length - 1]);
              availableQuestions.d3c2.pop();
              amountByDiff[2]++; amountByCat[1]++; ballsLeft -= 3;
              if (availableQuestions.d3c2.length === 0) {
                caseAvailable[7] = false;
                checkIfAvailable();
              }
              break;
            } case 9: {
              questionIdToSubmit.push(availableQuestions.d3c3[availableQuestions.d3c3.length - 1]);
              availableQuestions.d3c3.pop();
              amountByDiff[2]++; amountByCat[2]++; ballsLeft -= 3;
              if (availableQuestions.d3c3.length === 0) {
                caseAvailable[8] = false;
                checkIfAvailable();
              }
              break;
            } case 10: {
              questionIdToSubmit.push(availableQuestions.d4c1[availableQuestions.d4c1.length - 1]);
              availableQuestions.d4c1.pop();
              amountByDiff[3]++; amountByCat[0]++; ballsLeft -= 4;
              if (availableQuestions.d4c1.length === 0) {
                caseAvailable[9] = false;
                checkIfAvailable();
              }
              break;
            } case 11: {
              questionIdToSubmit.push(availableQuestions.d4c2[availableQuestions.d4c2.length - 1]);
              availableQuestions.d4c2.pop();
              amountByDiff[3]++; amountByCat[1]++; ballsLeft -= 4;
              if (availableQuestions.d4c2.length === 0) {
                caseAvailable[10] = false;
                checkIfAvailable();
              }
              break;
            } case 12: {
              questionIdToSubmit.push(availableQuestions.d4c3[availableQuestions.d4c3.length - 1]);
              availableQuestions.d4c3.pop();
              amountByDiff[3]++; amountByCat[2]++; ballsLeft -= 4;
              if (availableQuestions.d4c3.length === 0) {
                caseAvailable[11] = false;
                checkIfAvailable();
              }
              break;
            } default: {
              flag = false;
              break;
            }
          }
        }
      }
      if (completed) {
        return true;
      }
      return false;
    })
    .then((result) => {
      if (result) {
        return questionIdToSubmit.reverse();
      }
      return false;
    });
};

apiModule.makeTestSubmission = function (testAssignmentId, studentId) {
  let assignmentToSubmit;
  return TestAssignment
    .findById(testAssignmentId)
    .then((assignment) => {
      assignmentToSubmit = assignment;
    })
    .then(() => apiModule.getQuestionsToSubmit(
      assignmentToSubmit.tags,
      assignmentToSubmit.type,
      assignmentToSubmit.testSize,
    ))
    .then((questionsInSub) => {
      if (questionsInSub) {
        return TestSubmission.create({
          userId: studentId,
          creationDate: Date.now(),
          timeToPass: assignmentToSubmit.timeToPass,
          status: SUBMISSION_STATUS_PENDING,
          assignmentId: assignmentToSubmit._id,
          questionsId: questionsInSub,
        });
      }
    })
    .then((submission) => {
      if (submission !== null && assignmentToSubmit.studentId !== undefined) {
        return TestAssignment
          .findByIdAndUpdate(testAssignmentId, { $set: { status: ASSIGNMENT_STATUS_PASSED } })
          .then(() => TestSubmission
            .findById(submission._id)
            .populate('questionsId', '_id category difficulty question answerOptions tags')
            .lean());
      }
      return false;
    });
};

module.exports = apiModule;
