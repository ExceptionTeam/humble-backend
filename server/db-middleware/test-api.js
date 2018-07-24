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

apiModule.getSectionByRequest = function (request) {
  return sectionApi.getSectionById(request.sectionId);
};

apiModule.acceptableSectionsToRequest = function (userId) {
  let result = [Section];
  let checking = [Section];

  return sectionApi.getAllSections()
    .then((section) => {
      result = section;
      return apiModule.getStudentRequestsWithStatus(
        userId,
        [REQUEST_STATUS_APPROVED, REQUEST_STATUS_PENDING],
      );
    })
    .then(allUnacceptableRequests =>
      Promise.all(allUnacceptableRequests.map(el => this.getSectionByRequest(el))))
    .then((arr) => {
      checking = arr;
      return result.filter(object => checking.forEach((element) => {
        if (element === object) {
          return false;
        }
        return true;
      }));
    });
};

module.exports = apiModule;
