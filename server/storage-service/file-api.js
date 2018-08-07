const s3 = require('../initialization/aws');
const { BUCKET_NAME } = require('../../config');
const bucketStructure = require('./bucket-structure');

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
  params.ContentEncoding = 'utf-8';
  return s3.upload(params, (err) => {
    if (err) {
      throw new Error(err);
    }
  }).promise();
};

awsModule.getFile = function (key) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };
  return s3.getObject(params).promise();
};

awsModule.getFileStream = function (key) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };
  return s3.getObject(params).createReadStream();
};

awsModule.deleteFilesByName = function (keys) {
  const params = {
    Bucket: BUCKET_NAME,
    Delete: {
      Objects: keys,
      Quiet: false,
    },
  };
  return s3.deleteObjects(params).promise();
};

awsModule.uploadOldTests = function (tests, taskId) {
  return Promise.all(tests.map(el => this.upload({
    Bucket: BUCKET_NAME,
    Key: bucketStructure.generatePathTests(el.name, taskId),
    Body: el.data.Body,
  })));
};

awsModule.uploadNewTests = function (tests, taskId) {
  return Promise.all(Object.keys(tests).map(el => this.upload({
    Bucket: BUCKET_NAME,
    Key: bucketStructure.generatePathTests(el, taskId),
    Body: tests[el].data,
  })));
};

module.exports = awsModule;
