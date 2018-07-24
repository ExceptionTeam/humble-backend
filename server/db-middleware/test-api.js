// const { TestAssignment } = require('../models/testing/test-assignment');
// const { TestSubmission } = require('../models/testing/test-submission');
const { Section } = require('../models/testing/section');
const {
  Request,
  REQUEST_STATUS_APPROVED,
  REQUEST_STATUS_PENDING,
} = require('../models/testing/test-request');

const sectionApi = require('./section-api');

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
  let result = [Section];

  return sectionApi.getAllSections()
    .then((section) => {
      result = section;
      return apiModule.getStudentRequestsWithStatus(userId, [REQUEST_STATUS_APPROVED, REQUEST_STATUS_PENDING]);
    })
    .then(allUnacceptableRequests => Promise.all(allUnacceptableRequests.map(el => this.getSectionByRequestId(el))))
    .then((checking) => {
      console.log(result);
      console.log(checking);
      console.log(0);
      return result.filter(object => checking.every((element) => {
        console.log(element.id);
        console.log(object.id);
        if (element.id === object.id) { console.log(1); return false; }
        console.log(2);
        return true;
      }));
    });
};

module.exports = apiModule;
