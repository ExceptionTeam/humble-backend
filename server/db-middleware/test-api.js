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

apiModule.getAllStudentRequests = function (userId) {
  return Request
    .findById( userId )
    .populate( 
      'requestId',
      'userId section status' );
};

apiModule.getStudentRequestsWithStatus = function (userId, statusesToFind) {
  return Request
    .find({ userId, status: { $in:statusesToFind }})
    .populate(
      'requestId',
      'userId section status' );  
};

apiModule.getSectionByRequest = function (request) {
  return Section = sectionApi.getSectionById(request.sectionId)
    .populate('name','-_id');
};

apiModule.acceptableSectionsToRequest = function (userId) {
  const result = [];
  const checking = [];

  return sectionApi.getAllSections()
    .then((section) => {
      result = section
    })
    .then(() => {
      return getStudentRequestsWithStatus({REQUEST_STATUS_APPROVED, REQUEST_STATUS_PENDING})
    })
    .then((allUnacceptableRequests) => {
      for (var i = 0; i < allUnacceptableRequests.length; i++) {
        checking[i] = getSectionByRequest(allUnacceptableRequests[i]);
      }
    })
    .then(() => {
      result.filter(function (object) {
        for (var i = 0; i < checking.length; i++) {
          if (checking[i].id === object.id) {
            return true;
          }
        }
        return false;
      });
    })
};

module.exports = apiModule;
