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
}; = require('../models/testing/question');

const apiModule = {};

const checkRequestsForSections = function (sectId, studentId) {
  return Request
    .countDocuments({
      userId: studentId,
      sectionId: sectId,
      status: { $in: [REQUEST_STATUS_APPROVED, REQUEST_STATUS_PENDING] },
    })
    .then((count) => {
      if (!count) {
        return Section.findById(sectId);
      }
    });
};

apiModule.getAcceptableSectionsToRequest = function (studentId) {
  return Section
    .find()
    .then(sections => Promise.all(sections.map(el => checkRequestsForSections(el.id, studentId))))
    .then(sections => sections.filter((object) => {
      if (!object) {
        return false;
      }
      return true;
    }));
};

apiModule.newTestRequest = function (user, section) {
  return Request.create({
    userId: user,
    sectionId: section,
    status: REQUEST_STATUS_PENDING,
  });
};

apiModule.rejectRequest = function (requestId) {
  return Request
    .findByIdAndUpdate(requestId, { $set: { status: REQUEST_STATUS_REJECTED } });
};

const getAllTags = function (sectId) {
  return TagAttachment
    .find({ sectionId: sectId })
    .then(tags => Promise.all(tags.map(el => el.tag)));
};

apiModule.approveRequest = function (requestId, teachId) {
  let requestToRemember;
  let sectionName;
  return Request
    .findByIdAndUpdate(requestId, { $set: { status: REQUEST_STATUS_APPROVED } })
    .then((request) => {
      requestToRemember = request;
    })
    .then(() => Section
      .findById(requestToRemember.sectionId))
    .then((section) => {
      sectionName = 'Проверочный тест по секции: "' + section.name + '"';
    })
    .then(() => getAllTags(requestToRemember.sectionId))
    .then(allTags => TestAssignment.create({
      name: sectionName,
      studentId: requestToRemember.userId,
      teacherId: teachId,
      assignDate: Date.now(),
      tags: allTags,
    }));
};

apiModule.getPendingRequestsByTeacher = function (teacherId) {
  return generalApi.getStudentsByTeacherFlat(teacherId)
    .then(allStdIds => Request
      .find({ userId: { $in: allStdIds }, status: REQUEST_STATUS_PENDING })
      .populate('userId', '_id name surname __v')
      .populate('sectionId', '_id name')
      .lean());
};

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

const ppp = [2, 2, 2, 2];
const ggg = whatTasksToGet(11, ppp);

console.log(00000);
console.log(ggg);
console.log(00000);

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

const getQuestionsByAmountAndTags = function (questionTags, questionAmount) {
  const questionsLeft = questionAmount;
  const questionToSubmit = [];
  let flag = true;
  questionToSubmit.push(
    Question.findOne({ tags: { $in: questionTags }, active: true, category: CATEGORY_SENTENCE_ANSWER })
  )

  while(flag) {
    if (
      questionLeft[0]==0 &&
      questionLeft[1]==0 && 
      questionLeft[2]==0 &&
      questionLeft[3]==0 ){
      flag = false;
      continue;
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
