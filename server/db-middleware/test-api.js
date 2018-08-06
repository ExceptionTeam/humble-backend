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
  ASSIGNMENT_STATUS_EXPIRED,
} = require('../models/testing/test-assignment');
const {
  Question,
  CATEGORY_SINGLE_ANSWER,
  CATEGORY_MULTIPLE_ANSWERS,
  CATEGORY_WORD_ANSWER,
  CATEGORY_SENTENCE_ANSWER,
  TYPE_TRAINING_QUESTION,
  TYPE_PRIMARY_QUESTION,
} = require('../models/testing/question');
const { TagAttachment } = require('../models/testing/tag-attachment');
const generalApi = require('./general-api');
const submissionApi = require('./submission-api');

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

apiModule.getAcceptableSectionsToRequest = function (studentId, skip = 0, top = 20) {
  const sectionsToReturn = {};
  sectionsToReturn.sect = [];
  sectionsToReturn.amount = 0;
  return Section
    .find()
    .then(sections => Promise.all(sections.map(el => checkRequestsForSections(el.id, studentId))))
    .then(sections => sections.filter((object) => {
      if (!object) {
        return false;
      }
      return true;
    }))
    .then((sections) => {
      sectionsToReturn.amount = sections.length;
      if (+skip < sections.length && (+skip + +top) < sections.length) {
        sectionsToReturn.sect = sections.slice(skip, top);
      } else if (+skip < sections.length && (+skip + +top) >= sections.length) {
        sectionsToReturn.sect = sections.slice(skip, sections.length);
      }
      return sectionsToReturn;
    });
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
      assignDate: new Date().getTime(),
      tags: allTags,
    }));
};

apiModule.getPendingRequestsByTeacher = function (teacherId) {
  return generalApi.getStudentsByTeacherFlat(teacherId)
    .then(allStdIds => Request
      .find({ userId: { $in: allStdIds }, status: REQUEST_STATUS_PENDING })
      .populate('userId', '_id name surname')
      .populate('sectionId', '_id name')
      .lean());
};

apiModule.checkIfAssignmentsExpired = function () {
  const assignmentsToExpire = [];
  return TestAssignment.find({ status: ASSIGNMENT_STATUS_PENDING })
    .select('_id deadline')
    .then((allAssignments) => {
      allAssignments.forEach((el) => {
        if (el.deadline !== undefined && el.deadline < new Date().getTime()) {
          assignmentsToExpire.push(el._id);
        }
      });
    })
    .then(() => {
      Promise.all(assignmentsToExpire.map(el => TestAssignment.findByIdAndUpdate(
        el,
        { $set: { status: ASSIGNMENT_STATUS_EXPIRED } },
      )));
    });
};


apiModule.getStudAllAssignments = function (studId, skip = 0, top = 20) {
  const assignments = {};
  assignments.ids = [];
  assignments.amount = 0;
  return apiModule.checkIfAssignmentsExpired()
    .then(() => generalApi.getGroupIdsByStudent(studId))
    .then(groupIds => TestAssignment
      .find({
        groupId: { $in: groupIds },
      })
      .select('-__v -studentId -trainingPercentage ')
      .populate('teacherId', 'surname name')
      .populate('groupId', 'name'))
    .then((groupAssignments) => {
      groupAssignments.forEach(el => assignments.ids.push(el));
    })
    .then(() => TestAssignment
      .find({
        studentId: studId,
      })
      .select('-__v -studentId -trainingPercentage ')
      .populate('teacherId', 'surname name')
      .populate('groupId', 'name')
      .lean())
    .then((individualAssignments) => {
      individualAssignments.forEach(el => assignments.ids.push(el));
    })
    .then(() => {
      assignments.amount = assignments.ids.length;
      console.log(assignments);
      console.log(123);
      if (+skip < assignments.ids.length && (+skip + +top) < assignments.ids.length) {
        assignments.ids = assignments.ids.slice(skip, top);
      } else if (+skip < assignments.ids.length && (+skip + +top) >= assignments.ids.length) {
        assignments.ids = assignments.ids.slice(skip, assignments.ids.length);
      }
      return assignments;
    })
    .then(() => Promise
      .all(assignments.ids.map(el => submissionApi.getSubmissionsByAssignment(el._id))))
    .then((submissions) => {
      console.log(assignments);
      console.log(submissions);
      const map = {};
      assignments.ids.forEach((el) => { map[el._id] = el; });
      console.log(map);
      submissions.forEach((el) => {
        if (el.length) {
          console.log(el);
          console.log(el[0].assignmentId);
          map[el[0].assignmentId].submissionMark = el[0].mark;
          map[el[0].assignmentId].submissionStatus = el[0].status;
          console.log(33333);
        }
      });
      console.log(228);
      console.log(map);
      console.log(assignments);
    })
    .then(() => assignments);
};

apiModule.newQuestion = function (question) {
  return Question.create({
    section: question.section,
    tags: question.tags,
    type: question.type,
    active: question.active,
    category: question.category,
    question: question.question,
    questionAuthorId: question.questionAuthorId,
    answerOptions: question.answerOptions,
    correctOptions: question.correctOptions,
    difficulty: question.difficulty,
  });
};

apiModule.allTeachersAssignments = function (teachId, skip = 0, top = 10) {
  const allAssignments = {};
  allAssignments.assignAmount = 0;
  allAssignments.assignments = [];
  return TestAssignment
    .countDocuments({ teacherId: teachId })
    .then((amount) => {
      allAssignments.assignAmount = amount;
      return TestAssignment
        .find({ teacherId: teachId })
        .skip(+skip < 0 ? 0 : +skip)
        .limit(+top <= 0 ? 10 : +top)
        .populate('groupId', 'name')
        .populate('studentId', 'name surname')
        .lean();
    })
    .then((assignments) => {
      allAssignments.assignments = assignments;
      return allAssignments;
    });
};


module.exports = apiModule;
