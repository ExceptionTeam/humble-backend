const { TaskAssignment } = require('../models/tasks/task-assignment');
const { TaskSubmission } = require('../models/tasks/task-submission');
const { Task } = require('../models/tasks/task');

const generalApi = require('./general-api');

const apiModule = {};

const getAssignmentsByStudent = function (studentId) {
  return TaskAssignment
    .find({ studentId })
    .select('-__v -studentId -deadline')
    .populate(
      'taskId',
      '-inputFilesId -outputFilesId -tags -active -successfulAttempts -attempts -weight -_id -__v -description',
    )
    .populate('teacherId', '-_id -password -role -account -__v')
    .lean();
};

apiModule.getSubmissionsByAssignment = function (assignId, submissionProj) {
  return TaskSubmission
    .find({ assignId }, submissionProj);
};

const getAssignmentsByGroup = function (groupId) {
  return TaskAssignment
    .find({ groupId })
    .select('-__v -studentId -deadline -groupId')
    .populate('taskId', '-inputFilesId -outputFilesId -tags -successfulAttempts -_id -__v -description -active')
    .populate('teacherId', '-_id -password -role -account -__v')
    .lean();
};

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

apiModule.getAssignmentById = function (assignId, assignProj, taskProj, teacProj, studProj) {
  return TaskAssignment
    .findById(assignId, assignProj)
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
    .then(() => generalApi.getStudentsByGroup(studId, '-__v -_id -studentId'))
    .then((groupIds) => {
      if (groupIds.length) {
        return Promise.all(groupIds.map(el => getAssignmentsByGroup(el.groupId)));
      }
      return null;
    })
    .then((assignments) => {
      if (assignments && assignments.length && assignments[0].length) {
        result.assignment = result.assignment.concat(assignments);
      }
    })
    .then(() => Promise
      .all(result.assignment.map(el => apiModule.getSubmissionsByAssignment(el._id, '-_id -submitTime')
        .sort('-mark')
        .limit(1))))
    .then((submissions) => {
      const submitted = submissions.map(el => el[0]);
      const map = {};
      result.assignment.forEach((el) => { map[el._id] = el; });
      submitted.forEach((el) => {
        if (el) map[el.assignId].submission = el;
      });
    })
    .then(() => result.assignment);
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

apiModule.activateTask = function (taskId) {
  return Task.findByIdAndUpdate(taskId, { active: true });
};

module.exports = apiModule;
