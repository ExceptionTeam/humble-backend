const mongoose = require('mongoose');
const taskApi = require('../db-middleware/task-api');
const bucket = require('../initialization/aws');

const awsModule = {};

const BUCKET_NAME = 'example-bucket-12345/';

const uploadInput = function (file, taskId, number) {
  return awsModule.upload({
    Bucket: `${BUCKET_NAME}Task_${taskId}/Inputs`,
    Key: `input${number}.txt`,
    Body: file.data,
  });
};

const uploadOutput = function (file, taskId, number) {
  return awsModule.upload({
    Bucket: `${BUCKET_NAME}Task_${taskId}/Outputs`,
    Key: `output${number}.txt`,
    Body: file.data,
  });
};

awsModule.upload = function (params) {
  bucket.createBucket(() => {
    bucket.upload(params, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
};

awsModule.createTask = function (file, input, length) {
  const idBucket = new mongoose.Types.ObjectId();
  const idInputs = [];
  const idOutputs = [];

  for (let i = 0; i < length;) {
    uploadInput(file['input' + ++i], idBucket, i);
    const _id = new mongoose.Types.ObjectId();
    idInputs.push(_id);
    taskApi.addFile({
      _id,
      name: `input${i}`,
      url: `Task_${idBucket}/Inputs/input${i}`,
    });
  }

  for (let i = 0; i < length;) {
    uploadOutput(file['output' + ++i], idBucket, i);
    const _id = new mongoose.Types.ObjectId();
    idOutputs.push(_id);
    taskApi.addFile({
      _id,
      name: `output${i}`,
      url: `Task_${idBucket}/Outputs/output${i}`,
    });
  }

  taskApi.addTask({
    inputFilesId: idInputs,
    outputFilesId: idOutputs,
    tags: input.tags.split(' ,'),
    name: input.name,
    description: input.description,
    weight: input.weight,
  });
};

module.exports = awsModule;
