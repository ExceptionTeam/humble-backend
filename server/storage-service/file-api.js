const s3 = require('../initialization/aws');
const { BUCKET_NAME } = require('../../config');
const bucketStructure = require('./bucket-structure');

const awsModule = {};

const uploadInput = function (file, taskId, number) {
  return new Promise((resolve, reject) => {
    if (!file[bucketStructure.generateNameInput(number)]) {
      reject(new Error('Bad request!'));
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
      reject(new Error('Bad request!'));
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

awsModule.uploadBasisSubmission = function (file, taskId, submissionId, fileId) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: bucketStructure.generatePathSubmission(taskId, submissionId, fileId),
    Body: file.srcFile.data,
  };
  return awsModule.upload(params);
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

/* awsModule.getSourceFile = function(url){
 return s3.getObject({
   Bucket: BUCKET_NAME,
   Key: url
 }, function(err, data) {
 }).promise();
}; */

module.exports = awsModule;
