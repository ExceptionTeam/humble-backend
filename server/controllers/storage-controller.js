const mongoose = require('mongoose');
const taskApi = require('../db-middleware/task-api');
const fileApi = require('../storage-service/file-api');
const bucketStructure = require('../storage-service/bucket-structure');
const fs = require('fs');
const path = require('path');

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
    for (let i = 0; i < length; i++) {
      if (!file[bucketStructure.generateNameInput(i + 1)]
       && !body[bucketStructure.generateNameInput(i + 1)]) {
        reject(new Error());
      }
      if (!file[bucketStructure.generateNameOutput(i + 1)]
       && !body[bucketStructure.generateNameOutput(i + 1)]) {
        reject(new Error());
      }
    }
    if (!body.name || !body.description || !body.tags || !body.weight) {
      reject(new Error());
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
  let length;
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
    .then(() => taskApi.getTaskById(taskId))
    .then((task) => {
      length = task.inputFilesId.length;
    })
    .then(() => ({
      fileId,
      submissionId,
      length,
    }));
};

controller.downloadSubmission = function (submissionId) {
  return taskApi
    .getSubmissionById(submissionId)
    .then(file => fileApi.getFileStream(file.url));
};

controller.getFileById = function (id, name) {
  return taskApi.getFileById(id)
    .then(file => fileApi.getFile(file.url))
    .then(data => ({
      data,
      name,
    }));
};

controller.editTask = function (files, body, taskId, length) {
  let lengthInput;
  let filesArray = [];
  const inputsId = [];
  const outputsId = [];

  for (let i = 0; i < length; i++) {
    inputsId.push(new mongoose.Types.ObjectId());
    outputsId.push(new mongoose.Types.ObjectId());
  }

  return this.toEditValidation(files, body, length)
    .then(() => Promise.all(Object.keys(body).filter((el) => {
      if (el.startsWith('input') || el.startsWith('output')) {
        return true;
      }
      return false;
    }).map(el => this.getFileById(body[el], el))))
    .then((filesToSave) => {
      filesArray = filesToSave;
    })
    .then(() => taskApi.getTaskByIdAndUpdate(
      taskId,
      {
        name: body.name,
        description: body.description,
        tags: body.tags.split(','),
        weight: body.weight,
      },
    ))
    .then((data) => {
      lengthInput = data.inputFilesId.length;
      return Promise.all(data.inputFilesId.map(el => taskApi.deleteFile(el)))
        .then(() => Promise.all(data.outputFilesId.map(el => taskApi.deleteFile(el))));
    })
    .then(() => fileApi.deleteFilesByName(bucketStructure.generateArrayNames(taskId, lengthInput)))
    .then(() => fileApi.uploadOldTests(filesArray, taskId))
    .then(() => fileApi.uploadNewTests(files, taskId))
    .then(() => Promise.all(inputsId.map((el, i) => {
      taskApi.addFile({
        _id: el,
        name: bucketStructure.generateNameInput(i + 1),
        url: bucketStructure.generatePathInputs(taskId, i + 1),
      });
    })))
    .then(() => Promise.all(outputsId.map((el, i) => {
      taskApi.addFile({
        _id: el,
        name: bucketStructure.generateNameOutput(i + 1),
        url: bucketStructure.generatePathOutputs(taskId, i + 1),
      });
    })))
    .then(() => taskApi.getTaskByIdAndUpdate(
      taskId,
      {
        inputFilesId: inputsId,
        outputFilesId: outputsId,
      },
    ));
};

controller.getFileWithName = function (key) {
  const result = {};
  return fileApi.getFile(key)
    .then((file) => {
      result.file = file;
    })
    .then(() => {
      result.name = key.substring(key.search('input|output'), key.length);
    })
    .then(() => result);
};

controller.getTestsTask = function (myPath, submission) {
  let inputs;
  let outputs;
  return taskApi.getAssignmentById(submission.assignId)
    .then((assignment) => {
      inputs = assignment.taskId.inputFilesId;
      outputs = assignment.taskId.outputFilesId;
      if (inputs.length !== outputs.length) {
        throw new Error('Bad tests value!');
      }
    })
    .then(() => Promise.all(inputs.map(el => taskApi.getFileById(el))))
    .then((inputKeys) => {
      inputs = inputKeys;
    })
    .then(() => Promise.all(outputs.map(el => taskApi.getFileById(el))))
    .then(outputKeys => inputs.concat(outputKeys))
    .then(keys => Promise.all(keys.map(el => this.getFileWithName(el.url))))
    .then(files => Promise.all(files.map((el) => {
      fs.appendFile(path.join(myPath, el.name), el.file.Body, (err) => {
        if (err) {
          throw new Error('Appending error!');
        }
      });
    })))
    .then(() => taskApi.getFileById(submission.srcFileId))
    .then(key => fileApi.getFile(key.url))
    .then((file) => {
      fs.appendFile(path.join(myPath, 'Main.java'), file.Body, (err) => {
        if (err) {
          throw new Error('Appending error!');
        }
      });
    })
    .catch((err) => {
      throw new Error('Appending error!');
    });
};

module.exports = controller;
