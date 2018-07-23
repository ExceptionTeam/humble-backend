const { TestAssignment } = require('../models/testing/test-assignment');
const { TestSubmission } = require('../models/testing/test-submission');
const { Test } = require('../models/testing/test');
const { Section } = require('../models/testing/section');
const { 
  Request, 
  REQUEST_STATUS_APPROVED, 
  REQUEST_STATUS_PENDING, 
  REQUEST_STATUS_REJECTED } = require('../models/testing/test-request');

const generalApi = require('./general-api');
const sectionApi = require('./section-api');

const apiModule = {};

apiModule.getAllStudentRequests = function (userId) {
  return Request
    findById( userId )
    populate( 
      'requestId',
      'userId section status' );
};

apiModule.getAllStudentRequestsWithStatus = function (userId, statusToFind) {
  return Request
    .find({ userId, status: { $in:statusToFind })
    .populate(
      'requestId',
      'userId section status' );  
};

apiModule.acceptableSectionsToRequest = function (userId) {
  const result = {};
  const checking = {};

  return sectionApi.getAllSections()
    .then((section) => {
      result = section
    })
    .then(() => {
      checking = getAllStudentRequestsWithStatus({REQUEST_STATUS_APPROVED, REQUEST_STATUS_PENDING})
    })
    .then(() => {
      for( var i=result - 1; i>=0; i--){
        for( var j=0; j<checking; j++){
            if(result[i] && (result[i].status === checking[j].status)){
              result.splice(i, 1);
           }
         }
     }  
    })
    

};

module.exports = apiModule;
