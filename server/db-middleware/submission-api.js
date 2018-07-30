const {
  TestAssignment,
  //  ASSIGNMENT_STATUS_PENDING,
  ASSIGNMENT_STATUS_PASSED,
  //  ASSIGNMENT_STATUS_EXPIRED,
} = require('../models/testing/test-assignment');
const {
  TestSubmission,
  SUBMISSION_STATUS_PENDING,
} = require('../models/testing/test-submission');
// const { TagAttachment } = require('../models/testing/tag-attachment');
// const generalApi = require('./general-api');
const {
  Question,
  CATEGORY_SINGLE_ANSWER,
  CATEGORY_MULTIPLE_ANSWERS,
  CATEGORY_WORD_ANSWER,
  CATEGORY_SENTENCE_ANSWER,
//  TYPE_TRAINING_QUESTION,
//  TYPE_PRIMARY_QUESTION,
} = require('../models/testing/question');

//
// сейчас вытекут глаза, готовься
//

const apiModule = {};

/*
const whatTasksToGet = function (balls, questionInfo) {
  let flag = true;
  let completed = false;
  const questionLeft = questionInfo;
  console.log(questionLeft);
  const questionReceive = [0, 0, 0, 0];
  let ballsLeft = balls;
  console.log(ballsLeft);
  while (flag) {
    console.log(questionLeft);
    if (ballsLeft <= 0) {
      flag = false;
      completed = true;
      break;
    }
    if (
      (questionLeft[0] === 0 &&
      questionLeft[1] === 0 &&
      questionLeft[2] === 0 &&
      questionLeft[3] === 0) &&
      ballsLeft > 0) {
      flag = false;
      break;
    }
    if ((ballsLeft + 3 >= 4) && (questionLeft[3] > 0)) {
      console.log(4);
      console.log(ballsLeft);
      ballsLeft -= 4;
      questionLeft[3]--;
      questionReceive[3]++;
    }
    if ((ballsLeft + 2 >= 3) && (questionLeft[2] > 0)) {
      console.log(3);
      console.log(ballsLeft);
      ballsLeft -= 3;
      questionLeft[2]--;
      questionReceive[2]++;
    }
    if ((ballsLeft + 1 >= 2) && (questionLeft[1] > 0)) {
      console.log(2);
      console.log(ballsLeft);
      ballsLeft -= 2;
      questionLeft[1]--;
      questionReceive[1]++;
    }
    if ((ballsLeft >= 1) && (questionLeft[0] > 0)) {
      console.log(1);
      console.log(ballsLeft);
      ballsLeft -= 1;
      questionLeft[0]--;
      questionReceive[0]++;
    }
  }
  console.log(223);
  if (completed) return questionReceive;
  return false;
}; */

/* const ppp = [2, 2, 2, 2];
const ggg = whatTasksToGet(11, ppp);

console.log(00000);
console.log(ggg);
console.log(00000); */


const getQuestionsAndSort = function (questionTags, questionType) {
  const questions = {};
  questions.d1c1 = []; questions.d1c2 = []; questions.d1c3 = [];
  questions.d2c1 = []; questions.d2c2 = []; questions.d2c3 = [];
  questions.d3c1 = []; questions.d3c2 = []; questions.d3c3 = [];
  questions.d4c1 = []; questions.d4c2 = []; questions.d4c3 = [];
  return Question
    .find({
      tags: { $in: questionTags }, active: true, type: questionType,
    })
    .select('_id difficulty type')
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

const getCaseNumber = function (caseAvailable, byDifficulty, amountByType) {
  let caseNumber = -1;
  if (amountByType[0] <= amountByType[1] && amountByType[0] <= amountByType[2] &&
    byDifficulty[0] <= byDifficulty[1] && byDifficulty[0] <= byDifficulty[2] &&
    byDifficulty[0] <= byDifficulty[3] && caseAvailable.d1c1) {
    caseNumber = 1;
  } else if (amountByType[1] <= amountByType[0] && amountByType[1] <= amountByType[2] &&
    byDifficulty[0] <= byDifficulty[1] && byDifficulty[0] <= byDifficulty[2] &&
    byDifficulty[0] <= byDifficulty[3] && caseAvailable.d1c2) {
    caseNumber = 2;
  } else if (amountByType[2] <= amountByType[0] && amountByType[2] <= amountByType[1] &&
    byDifficulty[0] <= byDifficulty[1] && byDifficulty[0] <= byDifficulty[2] &&
    byDifficulty[0] <= byDifficulty[3] && caseAvailable.d1c3) {
    caseNumber = 3;
  } else if (amountByType[0] <= amountByType[1] && amountByType[0] <= amountByType[2] &&
    byDifficulty[1] <= byDifficulty[0] && byDifficulty[1] <= byDifficulty[2] &&
    byDifficulty[1] <= byDifficulty[3] && caseAvailable.d2c1) {
    caseNumber = 4;
  } else if (amountByType[1] <= amountByType[0] && amountByType[1] <= amountByType[2] &&
    byDifficulty[1] <= byDifficulty[0] && byDifficulty[1] <= byDifficulty[2] &&
    byDifficulty[1] <= byDifficulty[3] && caseAvailable.d2c2) {
    caseNumber = 5;
  } else if (amountByType[2] <= amountByType[0] && amountByType[2] <= amountByType[1] &&
    byDifficulty[1] <= byDifficulty[0] && byDifficulty[1] <= byDifficulty[2] &&
    byDifficulty[1] <= byDifficulty[3] && caseAvailable.d2c3) {
    caseNumber = 6;
  } else if (amountByType[0] <= amountByType[1] && amountByType[0] <= amountByType[2] &&
    byDifficulty[2] <= byDifficulty[0] && byDifficulty[2] <= byDifficulty[1] &&
    byDifficulty[2] <= byDifficulty[3] && caseAvailable.d3c1) {
    caseNumber = 7;
  } else if (amountByType[1] <= amountByType[0] && amountByType[1] <= amountByType[2] &&
    byDifficulty[2] <= byDifficulty[0] && byDifficulty[2] <= byDifficulty[1] &&
    byDifficulty[2] <= byDifficulty[3] && caseAvailable.d3c2) {
    caseNumber = 8;
  } else if (amountByType[2] <= amountByType[0] && amountByType[2] <= amountByType[1] &&
    byDifficulty[2] <= byDifficulty[0] && byDifficulty[2] <= byDifficulty[1] &&
    byDifficulty[2] <= byDifficulty[3] && caseAvailable.d3c3) {
    caseNumber = 9;
  } else if (amountByType[0] <= amountByType[1] && amountByType[0] <= amountByType[2] &&
    byDifficulty[4] <= byDifficulty[0] && byDifficulty[3] <= byDifficulty[1] &&
    byDifficulty[3] <= byDifficulty[2] && caseAvailable.d4c1) {
    caseNumber = 10;
  } else if (amountByType[1] <= amountByType[0] && amountByType[1] <= amountByType[2] &&
    byDifficulty[3] <= byDifficulty[0] && byDifficulty[3] <= byDifficulty[1] &&
    byDifficulty[3] <= byDifficulty[2] && caseAvailable.d4c2) {
    caseNumber = 11;
  } else if (amountByType[2] <= amountByType[0] && amountByType[2] <= amountByType[1] &&
    byDifficulty[3] <= byDifficulty[0] && byDifficulty[3] <= byDifficulty[1] &&
    byDifficulty[3] <= byDifficulty[2] && caseAvailable.d4c3) {
    caseNumber = 12;
  }
  return caseNumber;
};

const getQuestionsToSubmit = function (questionTags, questionType, balls) {
  const amountByDiff = [0, 0, 0, 0];
  const amountByType = [0, 0, 0];
  const questionToSubmit = [];
  const questionIdToSubmit = [];
  let ballsLeft = balls || 20;
  let flag = true;
  let completed = false;
  const caseAvailable = {};
  let caseNumber;
  let availableQuestions;
  return Question.findOne()({
    tags: { $in: questionTags },
    active: true,
    category: CATEGORY_SENTENCE_ANSWER,
    type: questionType,
  })
    .select('_id category difficulty')
    .then((buffer) => {
      if (buffer != null) {
        questionToSubmit.push(buffer);
        amountByDiff[buffer.difficulty - 1]++;
        ballsLeft -= buffer.difficulty;
      }
    })
    .then(() => {
      availableQuestions = getQuestionsAndSort(questionTags, questionType);
    })
    .then(() => {
      for (const key in availableQuestions) {
        if (key.length) {
          caseAvailable.key = false;
        }
      }
    })
    .then(() => {
      while (flag) {
        caseNumber = getCaseNumber(caseAvailable, amountByDiff, amountByType);
        if (ballsLeft < 0) {
          flag = false;
          completed = true;
          break;
        } else if (caseNumber === -1) {
          flag = false;
          break;
        } else {
          switch (caseNumber) {
            case 1: {
              questionIdToSubmit.push(availableQuestions.d1c1[availableQuestions.d1c1.length()]);
              availableQuestions.d1c1.pop();
              if (availableQuestions.d1c1.length() === 0) {
                caseAvailable.d1c1 = false;
              }
              break;
            } case 2: {
              questionIdToSubmit.push(availableQuestions.d1c2[availableQuestions.d1c2.length()]);
              availableQuestions.d1c2.pop();
              if (availableQuestions.d1c2.length() === 0) {
                caseAvailable.d1c2 = false;
              }
              break;
            } case 3: {
              questionIdToSubmit.push(availableQuestions.d1c3[availableQuestions.d1c3.length()]);
              availableQuestions.d1c3.pop();
              if (availableQuestions.d1c3.length() === 0) {
                caseAvailable.d1c3 = false;
              }
              break;
            } case 4: {
              questionIdToSubmit.push(availableQuestions.d2c1[availableQuestions.d2c1.length()]);
              availableQuestions.d2c1.pop();
              if (availableQuestions.d2c1.length() === 0) {
                caseAvailable.d2c1 = false;
              }
              break;
            } case 5: {
              questionIdToSubmit.push(availableQuestions.d2c2[availableQuestions.d2c2.length()]);
              availableQuestions.d2c2.pop();
              if (availableQuestions.d2c2.length() === 0) {
                caseAvailable.d2c2 = false;
              }
              break;
            } case 6: {
              questionIdToSubmit.push(availableQuestions.d2c3[availableQuestions.d2c3.length()]);
              availableQuestions.d2c3.pop();
              if (availableQuestions.d2c3.length() === 0) {
                caseAvailable.d2c3 = false;
              }
              break;
            } case 7: {
              questionIdToSubmit.push(availableQuestions.d3c1[availableQuestions.d3c1.length()]);
              availableQuestions.d3c1.pop();
              if (availableQuestions.d3c1.length() === 0) {
                caseAvailable.d3c1 = false;
              }
              break;
            } case 8: {
              questionIdToSubmit.push(availableQuestions.d3c2[availableQuestions.d3c2.length()]);
              availableQuestions.d3c2.pop();
              if (availableQuestions.d3c2.length() === 0) {
                caseAvailable.d3c2 = false;
              }
              break;
            } case 9: {
              questionIdToSubmit.push(availableQuestions.d3c3[availableQuestions.d3c3.length()]);
              availableQuestions.d3c3.pop();
              if (availableQuestions.d3c3.length() === 0) {
                caseAvailable.d3c3 = false;
              }
              break;
            } case 10: {
              questionIdToSubmit.push(availableQuestions.d4c1[availableQuestions.d4c1.length()]);
              availableQuestions.d4c1.pop();
              if (availableQuestions.d4c1.length() === 0) {
                caseAvailable.d4c1 = false;
              }
              break;
            } case 11: {
              questionIdToSubmit.push(availableQuestions.d4c2[availableQuestions.d4c2.length()]);
              availableQuestions.d4c2.pop();
              if (availableQuestions.d4c2.length() === 0) {
                caseAvailable.d4c2 = false;
              }
              break;
            } case 12: {
              questionIdToSubmit.push(availableQuestions.d4c3[availableQuestions.d4c3.length()]);
              availableQuestions.d4c3.pop();
              if (availableQuestions.d3c3.length() === 0) {
                caseAvailable.d4c3 = false;
              }
              break;
            } default: {
              flag = false;
            }
          }
        }
      }
      if (completed) {
        return questionToSubmit;
      }
      return false;
    });
};

apiModule.makeTestSubmission = function (testAssignmentId) {
  let assignmentToSubmit;
  let questionsInSub;
  return TestAssignment
    .findById(testAssignmentId)
    .then((assignment) => {
      assignmentToSubmit = assignment;
    })
    .then(() => {
      questionsInSub = getQuestionsToSubmit(assignmentToSubmit.tags, assignmentToSubmit.type);
    })
    .then(() => {
      if (questionsInSub) {
        return TestSubmission.create({
          userId: assignmentToSubmit.userId,
          creationDate: Date.now(),
          timeToPass: assignmentToSubmit.timeToPass,
          status: SUBMISSION_STATUS_PENDING,
          assignmentId: assignmentToSubmit._id,
          questionsId: questionsInSub,
        });
      }
    })
    .then((submission) => {
      if (submission !== null) {
        return TestAssignment
          .findByIdAndUpdate(testAssignmentId, { $set: { status: ASSIGNMENT_STATUS_PASSED } })
          .then(() => TestSubmission
            .findById(submission._id)
            .populate('questionsId', '_id category difficulty question answerOptions')
            .lean());
      }
      return false;
    });
};

module.exports = apiModule;
