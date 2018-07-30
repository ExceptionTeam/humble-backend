const { Section } = require('../models/testing/section');
const {
  Request,
  REQUEST_STATUS_APPROVED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_REJECTED,
} = require('../models/testing/test-request');
const {
  TestAssignment,
  ASSIGNMENT_STATUS_PENDING,
  ASSIGNMENT_STATUS_PASSED,
  ASSIGNMENT_STATUS_EXPIRED,
} = require('../models/testing/test-assignment');
const { TestSubmission } = require('../models/testing/test-submission');
const { TagAttachment } = require('../models/testing/tag-attachment');
const generalApi = require('./general-api');
const {
  Question,
  CATEGORY_SINGLE_ANSWER,
  CATEGORY_MULTIPLE_ANSWERS,
  CATEGORY_WORD_ANSWER,
  CATEGORY_SENTENCE_ANSWER,
  TYPE_TRAINING_QUESTION,
  TYPE_PRIMARY_QUESTION,
} = require('../models/testing/question');

//
//сейчас вытекут глаза, готовься
//

const apiModule = {};

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
    if ( ballsLeft <= 0 ){
      flag = false;
      completed = true;
      continue;
    }
    if (
      (questionLeft[0]==0 &&
      questionLeft[1]==0 && 
      questionLeft[2]==0 &&
      questionLeft[3]==0) && 
      ballsLeft > 0 ){
        flag = false;
        continue;
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
  if(completed) return questionReceive;
  return false;
};

/* const ppp = [2, 2, 2, 2];
const ggg = whatTasksToGet(11, ppp);

console.log(00000);
console.log(ggg);
console.log(00000); */

const getAmountOfQuestionsByTags = function (questionTags) {
  const questions = [];
  return Question
    .countDocuments({ tags: { $in: questionTags }, active: true, difficulty: 1 })
    .then((questionAmount) => {
      questions.push(questionAmount)
    })
    .then(() => Question
    .countDocuments({ tags: { $in: questionTags }, active: true, difficulty: 2 })
    )
    .then((questionAmount) => {
      questions.push(questionAmount)
    })
    .then(() => Question
    .countDocuments({ tags: { $in: questionTags }, active: true, difficulty: 3 })
    )
    .then((questionAmount) => {
      questions.push(questionAmount)
    })
    .then(() => Question
    .countDocuments({ tags: { $in: questionTags }, active: true, difficulty: 4 })
    )
    .then((questionAmount) => questions.push(questionAmount))
}

const getCaseNumber = function (caseAvailable, byDifficulty, amountByType) {
  if (amountByType[0]<=amountByType[1] && amountByType[0]<=amountByType[2] &&
    byDifficulty[0]>=byDifficulty[1] && byDifficulty[0]>=byDifficulty[2] && byDifficulty[0]>=byDifficulty[3] &&
    caseAvailable[0] ) {
      caseNumber = 11;
  } else if (amountByType[0]<=amountByType[1] && amountByType[0]<=amountByType[2] &&
    byDifficulty[1]>=byDifficulty[0] && byDifficulty[1]>=byDifficulty[2] && byDifficulty[1]>=byDifficulty[3] &&
    caseAvailable[1] ) {
      caseNumber = 12;
  } else if (amountByType[0]<=amountByType[1] && amountByType[0]<=amountByType[2] &&
    byDifficulty[2]>=byDifficulty[0] && byDifficulty[2]>=byDifficulty[1] && byDifficulty[2]>=byDifficulty[3] &&
    caseAvailable[2] ) {
      caseNumber = 13;
  } else if (amountByType[0]<=amountByType[1] && amountByType[0]<=amountByType[2] &&
    byDifficulty[4]>=byDifficulty[0] && byDifficulty[3]>=byDifficulty[1] && byDifficulty[3]>=byDifficulty[2] &&
    caseAvailable[3] ) {
      caseNumber = 14;
  } else if (amountByType[1]<=amountByType[0] && amountByType[1]<=amountByType[2] &&
    byDifficulty[0]>=byDifficulty[1] && byDifficulty[0]>=byDifficulty[2] && byDifficulty[0]>=byDifficulty[3] &&
    caseAvailable[4] ) {
      caseNumber = 21;
  } else if (amountByType[1]<=amountByType[0] && amountByType[1]<=amountByType[2] &&
    byDifficulty[1]>=byDifficulty[0] && byDifficulty[1]>=byDifficulty[2] && byDifficulty[1]>=byDifficulty[3] &&
    caseAvailable[5] ) {
      caseNumber = 22;
  } else if (amountByType[1]<=amountByType[0] && amountByType[1]<=amountByType[2] &&
    byDifficulty[2]>=byDifficulty[0] && byDifficulty[2]>=byDifficulty[1] && byDifficulty[2]>=byDifficulty[3] &&
    caseAvailable[6] ) {
      caseNumber = 23;
  } else if (amountByType[1]<=amountByType[0] && amountByType[1]<=amountByType[2] &&
    byDifficulty[3]>=byDifficulty[0] && byDifficulty[3]>=byDifficulty[1] && byDifficulty[3]>=byDifficulty[2] &&
    caseAvailable[7] ) {
      caseNumber = 24;
  } else if (amountByType[2]<=amountByType[0] && amountByType[2]<=amountByType[1] &&
    byDifficulty[0]>=byDifficulty[1] && byDifficulty[0]>=byDifficulty[2] && byDifficulty[0]>=byDifficulty[3] &&
    caseAvailable[8] ) {
      caseNumber = 31;
  } else if (amountByType[2]<=amountByType[0] && amountByType[2]<=amountByType[1] &&
    byDifficulty[1]>=byDifficulty[0] && byDifficulty[1]>=byDifficulty[2] && byDifficulty[1]>=byDifficulty[3] &&
    caseAvailable[9] ) {
      caseNumber = 32;
  } else if (amountByType[2]<=amountByType[0] && amountByType[2]<=amountByType[1] &&
    byDifficulty[2]>=byDifficulty[0] && byDifficulty[2]>=byDifficulty[1] && byDifficulty[2]>=byDifficulty[3] &&
    caseAvailable[10] ) {
      caseNumber = 33;
  } else if (amountByType[2]<=amountByType[0] && amountByType[2]<=amountByType[1] &&
    byDifficulty[3]>=byDifficulty[0] && byDifficulty[3]>=byDifficulty[1] && byDifficulty[3]>=byDifficulty[2] &&
    caseAvailable[11] ) {
      caseNumber = 34;
  } else if (caseAvailable.every(el => !el)) {
    caseNumber = 0;
  } else { caseNumber = -1; }
  return caseNumber;
}

const getQuestionByCase = function (caseAvailable, byDifficulty, amountByType) {

}

const getQuestionsByAmountAndTags = function (questionTags, questionAmount) {
  const leftByDifficulty = questionAmount;
  const amountByType = [0, 0, 0];
  const questionToSubmit = [];
  const caseNumber;
  let caseAvailable = 
  [true, true, true, true, true, true, true, true, true, true, true, true];
  let flag = true;
  let completed = false;
  let buffer;
  const includedQuestions = [];
  buffer = Question.findOneAndUpdate()({ tags: { $in: questionTags }, active: true, category: CATEGORY_SENTENCE_ANSWER })
    .select('_id category question answerOptions difficulty')
  if (buffer !== undefined) {
    questionToSubmit.push(buffer);
    leftByDifficulty[buffer.difficulty-1]--;
    Question.findByIdAndUpdate(buffer._id, { $set: { peopleTested: buffer.peopleTested++ } });
  }
  while (flag) {
    if (
      leftByDifficulty[0]===0 &&
      leftByDifficulty[1]===0 && 
      leftByDifficulty[2]===0 &&
      leftByDifficulty[3]===0 ){
        flag = false;
        completed = true;
        continue;
      }
    caseNumber =  getCaseNumber (caseAvailable, leftByDifficulty, amountByType)
    if (caseNumber === 0) {
        flag = false;
      }
    
    
    
    
    
  }
}

apiModule.makeTestSubmission = function (testAssignmentId) {
  let assignmentToSubmit;
  let questions;
  return TestAssignment
    .findByIdAndUpdate(testAssignmentId, { $set: { status: ASSIGNMENT_STATUS_PASSED } })
    .then((assignment) => assignmentToSubmit = assignment)
    .then(() => getAmountOfQuestionsByTags(assignmentToSubmit.tags))
    .then((questions) => whatTasksToGet(questions))
    .then((tasksAmount) => questions = getQuestionsByAmountAndTags(tasksAmount))
    // .then(() => 
}

module.exports = apiModule;
