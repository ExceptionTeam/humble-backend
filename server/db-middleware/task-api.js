const { TaskAssignment } = require('../models/tasks/task-assignment');
const { TaskSubmission } = require('../models/tasks/task-submission');
const { Task } = require('../models/tasks/task');
const { UserAssignment } = require('../models/user/user-assignment');

module.exports = function (app, db) {
  const module = {};

  module.getAllTasks = function (top, skip) {
    if(top < 0) top = 5;
    if(skip < 0) skip = 0;
    return Task
      .find({active: true})
      .skip(+skip)
      .limit(+top)
      .select('-inputFilesId -outputFilesId -active -successfulAttempts -attempts -__v')
      .exec();
  };

  module.getTaskById = function (taskId, taskProj, fileProj) {
    return Task
      .findById(taskId, taskProj)
      .populate('inputFilesId', fileProj)
      .populate('outputFilesId', fileProj)
      .lean();
  };

  module.getAssignmentById = function (assId, assProj, taskProj, teacProj, studProj) {
    return TaskAssignment
      .findById(assId, assProj)
      .populate('taskId', taskProj)
      .populate('teacherId', teacProj)
      .populate('studentId', studProj)
      .lean();
  };

    const getAssignmentsByStudent = function(studId){
      return TaskAssignment
      .find({studentId: studId})
      .select('-__v -studentId -deadline')
      .populate('taskId', '-inputFilesId -outputFilesId -tags -successfulAttempts -_id -__v -description')
      .populate('teacherId', '-_id -password -role -account -__v')
      .lean();
    };

    const getSubmissionsByAssignments = function(studAssignment){
      return TaskSubmission
      .find({assId: {$in: studAssignment}})
      .select('-__v')
      .lean();
    };

    const getGroupByStudId = function(studId){
      return UserAssignment
       .find({ studentId: studId })
       .select('-__v -_id -studentId -teacherId')
       .lean();
    };

    const getAssignmentByGroup = function(groupsId){
       return TaskAssignment
       .find({groupId: {$nin: groupsId}})
       .select('-__v -studentId -deadline -groupId')
       .populate('taskId', '-inputFilesId -outputFilesId -tags -successfulAttempts -_id -__v -description')
       .populate('teacherId', '-_id -password -role -account -__v')
       .lean();
    };

    module.getAllStudentTasks = function(studId){
        const result = {
          resolved: [],
          assignment: [],
        };

        let groupsId = [];

       return getAssignmentsByStudent(studId)
          .then((assignments) => {
            result.assignment = assignments;
          })
          .then(() => getGroupByStudId(studId))
          .then((groupId) => {
             groupsId = groupId.map(x=>{_id:x.groupId});
         })
        .then(() => getAssignmentByGroup(groupsId))
          .then((assignments) => {
              result.assignment = result.assignment.concat(assignments);
          })
          .then(() => getSubmissionsByAssignments(result.assignment))
          .then((submissions) => {
            result.resolved = submissions;
          })
          .then(() => result);
  };

  return module;
};
