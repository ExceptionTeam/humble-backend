const bucketStructure = require('./bucket-structure');
const s3 = require('../initialization/aws');
const { BUCKET_NAME } = require('../../config');

const awsModule = {};

const uploadInput = function (file, taskId, number) {
  return new Promise((resolve, reject) => {
    if (!file[bucketStructure.generateNameInput(number)]) {
      reject(new Error());
    }
    resolve();
  })
    .then(() => awsModule.upload({
      Bucket: BUCKET_NAME,
      Key: bucketStructure.generatePathInputs(taskId, number),
      Body: file[bucketStructure.generateNameInput(number)].data,
    }));
};

const uploadOutput = function (file, taskId, number) {
  return new Promise((resolve, reject) => {
    if (!file[bucketStructure.generateNameOutput(number)]) {
      reject(new Error());
    }
    resolve();
  })
    .then(() =>
      awsModule.upload({
        Bucket: BUCKET_NAME,
        Key: bucketStructure.generatePathOutputs(taskId, number),
        Body: file[bucketStructure.generateNameOutput(number)].data,
      }));
};

awsModule.uploadTogether = function (files, taskId, number) {
  return uploadInput(files, taskId, number)
    .then(() => uploadOutput(files, taskId, number));
};

awsModule.upload = function (params) {
  return s3.upload(params, (err) => {
    if (err) {
      throw new Error(err);
    }
  }).promise();
};

module.exports = awsModule;
