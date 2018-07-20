const { TaskAssignment } = require('../models/tasks/task-assignment');
const { TaskSubmission } = require('../models/tasks/task-submission');
const { Task } = require('../models/tasks/task');
const { UserAssignment } = require('../models/user/user-assignment');

const apiModule = {};

const getAssignmentsByStudent = function (studId) {
  return TaskAssignment
    .find({ studentId: studId })
    .select('-__v -studentId -deadline')
    .populate('taskId', '-inputFilesId -outputFilesId -tags -successfulAttempts -_id -__v -description')
    .populate('teacherId', '-_id -password -role -account -__v')
    .lean();
};

const getSubmissionsByAssignments = function (studAssignment) {
  const submission = studAssignment.map(el => el._id);
  return TaskSubmission
    .find({ assId: { $in: submission } })
    .select('-__v')
    .lean();
};

const getGroupByStudId = function (studId) {
  return UserAssignment
    .find({ studentId: studId })
    .select('-__v -_id -studentId -teacherId')
    .lean();
};

const getAssignmentByGroup = function (groupsId) {
  const group = groupsId.map(el => el.groupId);
  return TaskAssignment
    .find({ groupId: { $in: group } })
    .select('-__v -studentId -deadline -groupId')
    .populate('taskId', '-inputFilesId -outputFilesId -tags -successfulAttempts -_id -__v -description')
    .populate('teacherId', '-_id -password -role -account -__v')
    .lean();
};

/**
function to delete uneed assignments
const setNewResult = function (result) {
};
* */

apiModule.getAllTasks = function (skip = 0, top = 5) {
  return Task
    .find({ active: true })
    .skip(+skip < 0 ? 0 : +skip)
    .limit(+top <= 0 ? 5 : +top)
    .select('-inputFilesId -outputFilesId -tags -successfulAttempts -attempts -description -__v -active')
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

apiModule.getAllStudentTasks = function (studId) {
  const result = {};

  return getAssignmentsByStudent(studId)
    .then((assignments) => {
      result.assignment = assignments;
    })
    .then(() => getGroupByStudId(studId))
    .then(groupId => getAssignmentByGroup(groupId))
    .then((assignments) => {
      result.assignment = result.assignment.concat(assignments);
    })
    .then(() => getSubmissionsByAssignments(result.assignment))
    .then((submissions) => {
      result.resolved = submissions;
    })
    .then(() => /* setNewResult() */result);
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
