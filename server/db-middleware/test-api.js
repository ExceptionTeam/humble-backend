const { Section } = require('../models/testing/section');
const {
  Request,
  REQUEST_STATUS_APPROVED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_REJECTED,
} = require('../models/testing/test-request');
const { TestAssignment } = require('../models/testing/test-assignment');
const { TagAttachment } = require('../models/testing/tag-attachment');

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

apiModule.acceptableSectionsToRequest = function (studentId) {
  return Section
    .find()
    .then(sections => Promise.all(sections.map(el => checkRequestsForSections(el.id, studentId))))
    .then(sections => sections.filter((object) => {
      if (object == null) return false;
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
    .findById(requestId, (err, request) => {
      request.status = REQUEST_STATUS_REJECTED;
      request.save();
    });
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
    .findById(requestId, (err, request) => {
      request.status = REQUEST_STATUS_APPROVED;
      request.save();
    })
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

module.exports = apiModule;
