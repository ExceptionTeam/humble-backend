const { Section } = require('../models/testing/section');
const {
  Request,
  REQUEST_STATUS_APPROVED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_REJECTED,
} = require('../models/testing/test-request');

const apiModule = {};

apiModule.getStudentRequestsWithStatus = function (userId, statusesToFind) {
  return Request
    .find({ userId, status: { $in: statusesToFind } });
};

apiModule.getSectionByRequestId = function (requestId) {
  return Request
    .findById(requestId)
    .populate('sectionId')
    .then(request => request.sectionId);
};

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
    .then(sections => romise.all(sections.map(el => checkRequestsForSections(el.id, studentId))))
    .then((sections) => {

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
    .findById(requestId, (err, request) => {
      request.status = REQUEST_STATUS_REJECTED;
      request.save();
    });
};

apiModule.approveRequest = function (requestId) {
  return Request
    .findById(requestId, (err, request) => {
      request.status = REQUEST_STATUS_REJECTED;
      request.save();
    });
};

module.exports = apiModule;
