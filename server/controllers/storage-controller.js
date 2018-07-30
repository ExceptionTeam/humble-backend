const mongoose = require('mongoose');
const taskApi = require('../db-middleware/task-api');
const fileApi = require('../storage-service/file-api');
const bucketStructure = require('../storage-service/bucket-structure');

const controller = {};

controller.filesValidation = function (file, length) {
  return new Promise((resolve, reject) => {
    for (let i = 1; i <= length; i++) {
      if (!file[bucketStructure.generateNameInput(i)]
      || !file[bucketStructure.generateNameOutput(i)]) {
        reject(new Error());
      }
    }
    resolve();
  });
};

controller.fileValidation = function (file) {
  return new Promise((resolve, reject) => {
    if (file.srcFile) {
      resolve();
    } else {
      reject(new Error('Bad request!'));
    }
  });
};

controller.toEditValidation = function (file, body, length) {
  return new Promise((resolve, reject) => {
    for (let i = 1; i <= length; i++) {
      if (!file[bucketStructure.generateNameInput(i)]
      || !file[bucketStructure.generateNameOutput(i)]
      || !body[bucketStructure.generateNameInput(i)]
      || !body[bucketStructure.generateNameOutput(i)]) {
        reject(new Error());
      }
    }
    resolve();
  });
};

controller.createTask = function (file, input, length) {
  const idTask = new mongoose.Types.ObjectId();
  const idInputs = [];
  const idOutputs = [];
  const promises = new Array(+length).fill(0);

  return this.filesValidation(file, length)
    .then(() => Promise.all(promises.map((el, i) => fileApi.uploadTogether(file, idTask, i + 1))))
    .then(arr =>
      Promise.all(arr.map((el, i) => {
        const idFiles = {
          input: new mongoose.Types.ObjectId(),
          output: new mongoose.Types.ObjectId(),
        };
        idInputs.push(idFiles.input);
        idOutputs.push(idFiles.output);
        return taskApi.saveFiles(i + 1, idFiles, idTask, {
          input: bucketStructure.generateNameInput(i + 1),
          output: bucketStructure.generateNameOutput(i + 1),
          inputUrl: bucketStructure.generatePathInputs(idTask, i + 1),
          outputUrl: bucketStructure.generatePathOutputs(idTask, i + 1),
        });
      })))
    .then(() => taskApi.addTask({
      _id: idTask,
      inputFilesId: idInputs,
      outputFilesId: idOutputs,
      tags: input.tags.split(' ,'),
      name: input.name,
      description: input.description,
      weight: input.weight,
    }));
};

controller.createSubmission = function (file, assignId) {
  let taskId;
  const submissionId = new mongoose.Types.ObjectId();
  const fileId = new mongoose.Types.ObjectId();

  return this.fileValidation(file)
    .then(() => taskApi.getAssignmentByIdNonPopulate(assignId))
    .then((data) => {
      taskId = data.taskId;
    })
    .then(() => fileApi.uploadBasisSubmission(file, taskId, submissionId, fileId))
    .then(() => {
      const fileInfo = {
        _id: fileId,
        url: bucketStructure.generatePathSubmission(taskId, submissionId, fileId),
        name: bucketStructure.generateNameSubmission(fileId),
      };
      taskApi.addFile(fileInfo);
    })
    .then(result => ({
      fileId,
      submissionId,
    }));
};

controller.downloadSubmission = function (submissionId) {
  return taskApi
    .getSubmissionById(submissionId)
    .then(file => fileApi.getFile(file.url));
};

controller.editTask = function (files, body, taskId, length) {
  return this.toEditValidation(files, body, length)
    .then(() => {});
};

module.exports = controller;
