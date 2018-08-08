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
  TestSubmission,
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
const { TagAttachment } = require('../models/testing/tag-attachment');
const generalApi = require('./general-api');
const submissionApi = require('./submission-api');
const { User, USER_ROLE_STUDENT } = require('../models/user/user');
const checkGradeApi = require('./check-grade-api');

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

apiModule.getAllTags = function (sectId, filterConfig = []) {
  const configString = filterConfig.length ? filterConfig.reduce((container, el, i) => {
    if (i === 0) {
      return container + el;
    }
    return container + '|' + el;
  }, '') : '';
  const map = {};
  return TagAttachment
    .find(sectId ? { sectionId: sectId } : {})
    .find((filterConfig && filterConfig.length) ? { tag: { $regex: configString, $options: 'i' } } : {})
    .then(tags => Promise.all(tags.map(el => el.tag)))
    .then((res) => {
      res.forEach((el) => { map[el] = null; });
      return Object.keys(map);
    });
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
    .then(() => apiModule.getAllTags(requestToRemember.sectionId))
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

apiModule.allSubmissionsForAdmin = function (skip = 0, top = 10) {
  const submissions = {};
  submissions.amount = 0;
  submissions.subs = [];
  return TestSubmission
    .countDocuments()
    .then((amount) => {
      submissions.amount = amount;
      return TestSubmission
        .find()
        .populate('assignmentId', 'groupId')
        .populate('assignmentId.groupId', 'name')
        .populate('studentId', 'surname name')
        .skip(+skip < 0 ? 0 : +skip)
        .limit(+top <= 0 ? 10 : +top)
        .lean();
    })
    .then((subs) => {
      submissions.subs = subs;
      return submissions;
    });
};

apiModule.getStudAllAssignments = function (studId, skip = 0, top = 20, withPagination = true) {
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
      if (withPagination) {
        if (+skip < assignments.ids.length && (+skip + +top) < assignments.ids.length) {
          assignments.ids = assignments.ids.slice(skip, top);
        } else if (+skip < assignments.ids.length && (+skip + +top) >= assignments.ids.length) {
          assignments.ids = assignments.ids.slice(skip, assignments.ids.length);
        }
      }
      return assignments;
    })
    .then(() => Promise
      .all(assignments.ids.map(el => submissionApi.getSubmissionsByAssignment(el._id))))
    .then((submissions) => {
      const map = {};
      assignments.ids.forEach((el) => { map[el._id] = el; });
      submissions.forEach((el) => {
        if (el.length) {
          map[el[0].assignmentId].submissionMark = el[0].mark;
          map[el[0].assignmentId].submissionStatus = el[0].status;
        }
      });
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

apiModule.testAssign = function (assignment) {
  return TestAssignment
    .create({
      groupId: assignment.groupId,
      studentId: assignment.studentId,
      name: assignment.name,
      tags: assignment.tags,
      timeToPass: assignment.timeToPass,
      assignDate: new Date().getTime(),
      deadline: assignment.deadline,
      testSize: assignment.testSize,
      teacherId: assignment.teacherId,
      trainingPercentage: assignment.trainingPercentage,
      type: assignment.type,
    });
};

apiModule.getStatistics = function (amount) {
  let students;
  User
    .find({ role: USER_ROLE_STUDENT }, '_id name surname')
    .lean()
    .then((studs) => {
      students = studs;
      return Promise.all(students.map(el => apiModule
        .getStudAllAssignments(el._id, null, null, false)));
    })
    .then((tests) => {
      tests
        .forEach((el, j) => {
          const withSubmission = el.filter(elem => (!!elem.submissionMark));
          students[j].averageMark = withSubmission.length ? withSubmission
            .reduce(((sum, elem) => elem.submissionMark + sum), 0) / el.length : 0;
        });
      return students.sort((el1, el2) => el2.averageMark - el1.averageMark).slice(0, amount);
    });
};

apiModule.getInfoQuestion = function (id) {
  return Question.findById(id)
    .select('-__v');
};

module.exports = apiModule;
