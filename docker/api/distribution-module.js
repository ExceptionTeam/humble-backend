const fs = require('fs');
const { EventEmitter } = require('events');


module.exports = function (CONTAINERS_AMOUNT) {
  const distributionModule = {};
  const submissionQueue = [];
  const containerStatus = new Array(CONTAINERS_AMOUNT).fill(true);
  let semaphore = CONTAINERS_AMOUNT;

  distributionModule.enqueueSubmission = function (submission) {
    submissionQueue.push(submission);
  };

  distributionModule.dequeueSubmission = function () {
    semaphore--;
    return submissionQueue.shift();
  };

  distributionModule.tryEnterCompilationModule = function () {
    if (semaphore) {
      containerStatus.indexOf(true);
    }
  };

  return distributionModule;
};
