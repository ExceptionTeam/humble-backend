const { TaskAssignment } = require('../models/tasks/task-assignment');
const { Task } = require('../models/tasks/task');


const apiModule = {};

apiModule.getAllTasks = function () {
  return Task
    .find()
    .select('-inputFilesId -outputFilesId -tags -successfulAttempts -attempts -description -__v')
    .exec();
};

apiModule.getTaskById = function (taskId, taskProj, fileProj) {
  return Task
    .findById(taskId, taskProj)
    .populate('inputFilesId', fileProj)
    .populate('outputFilesId', fileProj);
};

apiModule.getAssignmentById = function (assId, assProj, taskProj, teacProj, studProj) {
  return TaskAssignment
    .findById(assId, assProj)
    .populate('taskId', taskProj)
    .populate('teacherId', teacProj)
    .populate('studentId', studProj);
};

apiModule.assignTask = function (assignmentInfo) {
  const newAssignment = new TaskAssignment(assignmentInfo);
  return newAssignment.save();
};

apiModule.deleteTask = function (taskId) {
  return TaskAssignment
    .find({ taskId, deadline: { $gt: new Date().getTime() } })
    .countDocuments()
    .then((count) => {
      if (count <= 0) {
        throw new Error('The task is in use right now');
      }
    })
    .then(() => Task.findByIdAndUpdate(taskId, { active: false }));
};

module.exports = apiModule;
