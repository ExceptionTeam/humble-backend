// const Docker = require('dockerode');
const { EventEmitter } = require('events');

const myEmmiter = new EventEmitter();

const CONTAINERS_AMOUNT = 5;

const saveModule = require('./save-module')();
const compilationModule = require('./compilation-module')(CONTAINERS_AMOUNT, saveModule.save);
const distributionModule = require('./distribution-module')(compilationModule.enter);

const semaphore = function () {
  let count = CONTAINERS_AMOUNT;
  return {
    wait() {
      if (count) {
        --count;
        distributionModule.tryEnterCompilationModule();
      }
    },
    signal() {
      if (!distributionModule.tryEnterCompilationModule()) {
        ++count;
      }
    },
  };
};

// const docker = new Docker();

module.exports = function () {

};
