const { TestAssignment } = require('../models/testing/test-assignment');
const { TestSubmission } = require('../models/testing/test-submission');
const { Test } = require('../models/testing/test');
const { Section } = require('../models/testing/section');
const { 
  Request, 
  REQUEST_STATUS_APPROVED, 
  REQUEST_STATUS_PENDING, 
  REQUEST_STATUS_REJECTED } = require('../models/testing/test-request');

const sectionApi = require('./section-api');

const apiModule = {};
/*
apiModule.getAllStudentRequests = function (userId) {
  return Request
    .find({ userId })
};*/

apiModule.getStudentRequestsWithStatus = function (userId, statusesToFind) {
  return Request
    .find({ userId, status: { $in:statusesToFind }})
};

apiModule.getSectionByRequest = function (request) {
  return sectionApi.getSectionById(request.sectionId)
};

apiModule.acceptableSectionsToRequest = function (userId) {
  const result = [];
  const checking = [];

  return sectionApi.getAllSections()
    .then((section) => {
      result = section;
      return getStudentRequestsWithStatus([REQUEST_STATUS_APPROVED, REQUEST_STATUS_PENDING])
    })
    .then((allUnacceptableRequests) => {
      Promise.all(arr.map((el) => this.getSectionByRequest(el)));
    })
    .then((arr) => {
      checking = arr;
      result.filter(function (object) {
        checking.forEach(function(element) {
          if (element === object) {
            return true;
          }
        })
      })
    })
};

module.exports = apiModule;
