const mongoose = require('mongoose');
const taskApi = require('../db-middleware/task-api');
const s3 = require('../initialization/aws');
const { BUCKET_NAME } = require('../../config');
const bucketStructure = require('./bucket-structure');

const awsModule = {};

const uploadInput = function (file, taskId, number) {
  return awsModule.upload({
    Bucket: BUCKET_NAME,
    Key: bucketStructure.generatePathInputs(taskId, number),
    Body: file.data,
  }, (err) => {
    throw new Error(err);
  });
};

const uploadOutput = function (file, taskId, number) {
  return awsModule.upload({
    Bucket: BUCKET_NAME,
    Key: bucketStructure.generatePathOutputs(taskId, number),
    Body: file.data,
  }, (err) => {
    throw new Error(err);
  });
};

const storageSave = function (number, idFiles, taskId) {
  return taskApi.addFile({
    _id: idFiles.input,
    name: bucketStructure.generateNameInput(number),
    url: bucketStructure.generatePathInputs(taskId, number),
  })
    .then(() => taskApi.addFile({
      _id: idFiles.output,
      name: bucketStructure.generateNameOutput(number),
      url: bucketStructure.generatePathOutputs(taskId, number),
    }));
};

const uploadTogether = function (files, taskId, number) {
  return uploadInput(files.input, taskId, number)
    .then(() => uploadOutput(files.output, taskId, number));
};

awsModule.upload = function (params) {
  return s3.upload(params, (err) => {
    if (err) {
      throw new Error(err);
    }
  }).promise();
};

awsModule.createTask = function (file, input, length) {
  const idTask = new mongoose.Types.ObjectId();
  const idInputs = [];
  const idOutputs = [];
  const promises = new Array(+length).fill(0);

  Promise.all(promises.map((el, i) => uploadTogether(
    {
      input: file[bucketStructure.generateNameInput(i + 1)],
      output: file[bucketStructure.generateNameOutput(i + 1)],
    },
    idTask, i + 1,
  )))
    .then(arr =>
      Promise.all(arr.map((el, i) => {
        const idFiles = {
          input: new mongoose.Types.ObjectId(),
          output: new mongoose.Types.ObjectId(),
        };
        idInputs.push(idFiles.input);
        idOutputs.push(idFiles.output);
        return storageSave(i + 1, idFiles, idTask);
      })))
    .then(() => taskApi.addTask({
      _id: idTask,
      inputFilesId: idInputs,
      outputFilesId: idOutputs,
      tags: input.tags.split(' ,'),
      name: input.name,
      description: input.description,
      weight: input.weight,
    }))
    .catch((err) => {
      throw new Error(err);
    });
};

module.exports = awsModule;
