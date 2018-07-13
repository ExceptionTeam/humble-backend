const { Task } = require('../models/tasks/task');

module.exports = function (app, db) {
  const module = {};

  module.getAllTasks = function () {
    return Task
      .find({})
      .select({
        inputFilesId: 0,
        outputFilesId: 0,
        tags: 0,
        successfulAttempts: 0,
        attempts: 0,
        description: 0,
        __v: 0,
      }).exec();
  };

  return module;
};
