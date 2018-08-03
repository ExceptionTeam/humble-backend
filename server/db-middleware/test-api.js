const { Section } = require('../models/testing/section');
const {
  Request,
  REQUEST_STATUS_APPROVED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_REJECTED,
} = require('../models/testing/test-request');
const {
  TestAssignment,
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

apiModule.getAllTags = function (sectId, filterConfig = []) {
  const configString = filterConfig.length ? filterConfig.reduce((container, el, i) => {
    if (i === 0) {
      return container + el;
    }
    return container + '|' + el;
  }) : '';
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

module.exports = apiModule;
