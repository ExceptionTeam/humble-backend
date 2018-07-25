// const Docker = require('dockerode');
const { EventEmitter } = require('events');

const myEmmiter = new EventEmitter();

const CONTAINERS_AMOUNT = 5;

const saveModule = require('./save-module')();
const compilationModule = require('./compilation-module')(CONTAINERS_AMOUNT, saveModule.save);
const distributionModule = require('./distribution-module')(compilationModule.enter);

const semaphore = function () {
  let count = CONTAINERS_AMOUNT;
  const queue = distributionModule.submissionQueue;
  return {
    wait(submission) {
      if (count) {
        --count;
        distributionModule.tryEnterCompilationModule();
      } else {
        queue.enqueueSubmission(submission);
      }
    },
    signal() {
      if (queue.length) {
        distributionModule.tryEnterCompilationModule();
      } else {
        ++count;
      }
    },
  };
};

// const docker = new Docker();

module.exports = function () {

};
