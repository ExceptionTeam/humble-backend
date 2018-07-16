const { TaskAssignment } = require('../models/tasks/task-assignment');
const { Task } = require('../models/tasks/task');
const { User, USER_ROLE_TEACHER, USER_ROLE_STUDENT } = require('../models/user/user');


module.exports = function (app, db) {
  const module = {};

  module.getAssignmentById = function (assId, assProj, taskProj, teacProj, studProj) {
    return TaskAssignment
      .findById(assId, assProj /* '-_id -studentId -__v' */)
      .populate('taskId', taskProj /* 'name description weight -_id' */)
      .populate('teacherId', teacProj /* 'name surname -_id' */)
      .populate('studentId', studProj);
  };


  return module;
};
