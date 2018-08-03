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
const { TagAttachment } = require('../models/testing/tag-attachment');
const generalApi = require('./general-api');

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

apiModule.checkIfAssignmentsExpired = function (assignmentIds) {
  const actualAssignmentIds = [];
  const assignmentsToExpire = [];
  return TestAssignment.find({ _id: { $in: assignmentIds } })
    .select('-__v -studentId -trainingPercentage -status')
    .populate('teacherId', 'surname name')
    .populate('groupId', 'name')
    .then((allAssignments) => {
      allAssignments.forEach((el) => {
        if (el.deadline !== null && el.deadline < new Date().getTime()) {
          assignmentsToExpire.push(el._id);
        } else actualAssignmentIds.push(el);
      });
    })
    .then(() => {
      Promise.all(assignmentsToExpire.map(el => TestAssignment.findByIdAndUpdate(
        el,
        { $set: { status: ASSIGNMENT_STATUS_EXPIRED } },
      )));
    })
    .then(() => actualAssignmentIds);
};

apiModule.getStudAllAssignments = function (studId) {
  const assignmentIds = [];
  return generalApi.getGroupIdsByStudent(studId)
    .then(groupIds => TestAssignment
      .find({
        groupId: { $in: groupIds },
        status: ASSIGNMENT_STATUS_PENDING,
      })
      .select('_id'))
    .then(groupAssignments => apiModule.checkIfAssignmentsExpired(groupAssignments))
    .then((groupAssignments) => {
      groupAssignments.forEach(el => assignmentIds.push(el));
    })
    .then(() => TestAssignment
      .find({ studentId: studId })
      .select('_id'))
    .then(individualAssignments => apiModule.checkIfAssignmentsExpired(individualAssignments))
    .then((individualAssignments) => {
      individualAssignments.forEach(el => assignmentIds.push(el));
    })
    .then(() => assignmentIds);
};

module.exports = apiModule;
