const { TaskAssignment } = require('../models/tasks/task-assignment');
const { Task } = require('../models/tasks/task');


module.exports = function (app, db) {
  const module = {};

  module.getAllTasks = function () {
    return Task
      .find()
      .select('-inputFilesId -outputFilesId -tags -successfulAttempts -attempts -description -__v')
      .exec();
  };

  module.getTaskById = function (taskId, taskProj, fileProj) {
    return Task
      .findById(taskId, taskProj)
      .populate('inputFilesId', fileProj)
      .populate('outputFilesId', fileProj);
  };

  module.getAssignmentById = function (assId, assProj, taskProj, teacProj, studProj) {
    return TaskAssignment
      .findById(assId, assProj)
      .populate('taskId', taskProj)
      .populate('teacherId', teacProj)
      .populate('studentId', studProj);
  };

  module.assignTask = function (assignmentInfo) {
    const newAssignment = new TaskAssignment(assignmentInfo);
    return newAssignment.save();
  };


  return module;
};
