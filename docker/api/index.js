// const Docker = require('dockerode');
const { EventEmitter } = require('events');
const fs = require('fs');

const myEmmiter = new EventEmitter();

const CONTAINERS_AMOUNT = 5;

(function initContainersFolder() {
  fs.mkdir('./docker/containers', (err) => {
    if (!err) {
      for (let i = 0; i < CONTAINERS_AMOUNT; i++) {
        fs.mkdir('./docker/containers/volume-' + i, () => {});
      }
    }
  });
}());


const saveModule = require('./save-module')(myEmmiter);
const compilationModule = require('./compilation-module')(CONTAINERS_AMOUNT, saveModule.save);
const distributionModule = require('./distribution-module')(compilationModule.enter, CONTAINERS_AMOUNT, myEmmiter);

myEmmiter.on('submission-new', distributionModule.semaphore.wait);
myEmmiter.on('submission-save', distributionModule.semaphore.signal);

// const docker = new Docker();

module.exports = { enqueueSubmission: distributionModule.submissionQueue.enqueueSubmission };
