const { EventEmitter } = require('events');

const compilationModule = require('./compilation-module');


module.exports = function (CONTAINERS_AMOUNT) {
  const distributionModule = {};
  const submissionQueue = [];
  const containerStatus = new Array(CONTAINERS_AMOUNT).fill(true);
  let semaphore = CONTAINERS_AMOUNT;

  distributionModule.enqueueSubmission = function (submission) {
    submissionQueue.push(submission);
  };

  distributionModule.dequeueSubmission = function () {
    if (submissionQueue.length) {
      semaphore--;
      return submissionQueue.shift();
    }
    return null;
  };

  distributionModule.tryEnterCompilationModule = function () {
    if (semaphore) {
      const submission = distributionModule.dequeueSubmission();
      if (submission) {
        compilationModule.prepareData(containerStatus.indexOf(true), submission);
      }
    }
  };

  return distributionModule;
};
