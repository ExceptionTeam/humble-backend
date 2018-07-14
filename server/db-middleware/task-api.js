const { TaskAssignment } = require('../models/tasks/task-assignment');
const { Task } = require('../models/tasks/task');
const { User, USER_ROLE_TEACHER, USER_ROLE_STUDENT } = require('../models/user/user');


module.exports = function (app, db) {
  const module = {};

  module.getAssignmentById = function (assId) {
    return TaskAssignment
      .findById(assId)
      .select('-_id -studentId -__v')
      .populate('taskId', 'name description weight -_id')
      .populate('teacherId', 'name surname -_id');
  };


  return module;
};
