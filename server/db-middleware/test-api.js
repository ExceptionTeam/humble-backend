const { Section } = require('../models/testing/section');
const {
  Request,
  REQUEST_STATUS_APPROVED,
  REQUEST_STATUS_PENDING,
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

apiModule.acceptableSectionsToRequest = function (userId) {
  let result = [];

  return Section
    .find()
    .then((sections) => {
      result = sections;
      return apiModule.getStudentRequestsWithStatus(userId, [REQUEST_STATUS_APPROVED, REQUEST_STATUS_PENDING]);
    })
    .then(allUnacceptableRequests => Promise.all(allUnacceptableRequests.map(el => this.getSectionByRequestId(el))))
    .then(checking => result.filter(object => checking.every((element) => {
      if (element.id === object.id) { return false; }
      return true;
    })));
};

module.exports = apiModule;
