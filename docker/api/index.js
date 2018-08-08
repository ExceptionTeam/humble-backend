const { EventEmitter } = require('events');

const myEmmiter = new EventEmitter();

const { CONTAINERS_AMOUNT } = require('../../config');

const containerInfoPromise = require('./initialization');

const saveModule = require('./save-module')(myEmmiter);
const compilationModule = require('./compilation-module')(containerInfoPromise, saveModule.save);
const distributionModule = require('./distribution-module')(compilationModule.enter, CONTAINERS_AMOUNT, myEmmiter);

myEmmiter.on('submission-new', distributionModule.semaphore.wait);
myEmmiter.on('submission-save', distributionModule.semaphore.signal);

module.exports = distributionModule.submissionQueue.enqueueSubmission;
