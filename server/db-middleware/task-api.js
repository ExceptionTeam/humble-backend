const { TaskAssignment } = require('../models/tasks/task-assignment');
const { TaskSubmission } = require('../models/tasks/task-submission');
const { Task } = require('../models/tasks/task');
const { File } = require('../models/tasks/file');
const { User, USER_ROLE_STUDENT } = require('../models/user/user');

const generalApi = require('./general-api');

const apiModule = {};

const getAssignmentsByStudent = function (studentId) {
  return TaskAssignment
    .find({ studentId })
    .select('-__v -studentId -deadline')
    .populate(
      'taskId',
      '-inputFilesId -outputFilesId -tags -active -successfulAttempts -attempts -_id -__v -description',
    )
    .populate('teacherId', '-_id -password -role -account -__v')
    .lean();
};

const validateTaskEditability = function (taskId) {
  return TaskAssignment
    .find({ taskId, deadline: { $gt: new Date().getTime() } })
    .countDocuments()
    .then((count) => {
      if (count <= 0) {
        return true;
      }
      return false;
    });
};

const getAssignmentsByGroup = function (groupId) {
  return TaskAssignment
    .find({ groupId })
    .select('-__v -studentId -deadline -groupId')
    .populate('taskId', '-inputFilesId -outputFilesId -tags -successfulAttempts -_id -__v -description -active')
    .populate('teacherId', '-_id -password -role -account -__v')
    .lean();
};

apiModule.getSubmissionsByAssignment = function (assignId, submissionProj, fileProj) {
  return TaskSubmission
    .find({ assignId }, submissionProj)
    .populate('srcFileId', fileProj);
};

apiModule.getAllTasks = function (skip = 0, top = 5, taskProj, filterConfig, active = true) {
  const resTasks = {};
  const configString = filterConfig.length ? filterConfig.reduce((container, el, i) => {
    if (i === 0) {
      return container + el;
    }
    return container + '|' + el;
  }) : '';
  return Task
    .find(active ? { active } : {})
    .find({ $or: [{ name: { $regex: configString, $options: 'i' } }, { tags: { $in: filterConfig } }] })
    .skip(+skip < 0 ? 0 : +skip)
    .limit(+top <= 0 ? 5 : +top)
    .select(taskProj)
    .then((tasks) => {
      resTasks.data = tasks;
      return Task
        .find(active ? { active } : {})
        .countDocuments();
    })
    .then((total) => {
      resTasks.pagination = { total };
      return Task
        .find(active ? { active } : {})
        .find({ $or: [{ name: { $regex: configString, $options: 'i' } }, { tags: { $in: filterConfig } }] })
        .countDocuments();
    })
    .then((filtered) => {
      resTasks.pagination.filtered = filtered;
      return resTasks;
    });
};

apiModule.getTaskById = function (taskId, taskProj, fileProj, validate = false) {
  let resTask;
  return Task
    .findById(taskId, taskProj)
    .populate('inputFilesId', fileProj)
    .populate('outputFilesId', fileProj)
    .lean()
    .then((task) => {
      resTask = task;
      if (validate) {
        return validateTaskEditability(taskId);
      }
      return Promise.resolve(true);
    })
    .then((validated) => {
      if (validated) {
        resTask.editable = true;
      } else {
        resTask.editable = false;
      }
      return resTask;
    });
};

apiModule.getTaskByIdAndUpdate = function (taskId, update, validate = false) {
  let resTask;
  return Task
    .findByIdAndUpdate(taskId, update)
    .lean()
    .then((task) => {
      resTask = task;
      if (validate) {
        return validateTaskEditability(taskId);
      }
      return Promise.resolve(true);
    })
    .then((validated) => {
      if (validated) {
        resTask.editable = true;
      } else {
        resTask.editable = false;
      }
      return resTask;
    });
};

apiModule.getAssignmentById = function (assignId, assignProj, taskProj, teacProj, studProj) {
  return TaskAssignment
    .findById(assignId, assignProj)
    .populate('taskId', taskProj)
    .populate('teacherId', teacProj)
    .populate('studentId', studProj);
};

apiModule.getAssignmentByIdNonPopulate = function (assignId) {
  return TaskAssignment
    .findById(assignId);
};

apiModule.getAllStudentTasks = function (studId) {
  const result = {};

  return getAssignmentsByStudent(studId)
    .then((assignments) => {
      result.assignment = assignments;
    })
    .then(() => generalApi.getGroupsByStudent(studId))
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
    .then(() => Promise.all(result.assignment.map(el => getBestSubmissionByAssignment(el._id, '-_id -submitTime'))))
    .then((submissions) => {
      if (submissions.length) {
        const submitted = submissions.map(el => el[0]);
        const map = {};
        result.assignment.forEach((el) => { map[el._id] = el; });
        submitted.forEach((el) => {
          if (el) {
            map[el.assignId].submission = el;
          }
        });
      }
    })
    .then(() => result.assignment);
};

apiModule.assignTask = function (assignmentInfo) {
  const newAssignment = new TaskAssignment(assignmentInfo);
  return newAssignment.save();
};

apiModule.addTask = function (taskInfo) {
  const newTask = new Task(taskInfo);
  return newTask.save();
};

apiModule.addFile = function (fileInfo) {
  const newFile = new File(fileInfo);
  return newFile.save();
};

apiModule.addFile = function (fileInfo) {
  const newFile = new File(fileInfo);
  return newFile.save();
};

apiModule.deleteFile = function (fileId) {
  return File.findByIdAndRemove(fileId);
};

apiModule.deleteTask = function (taskId) {
  return validateTaskEditability(taskId)
    .then((validated) => {
      if (validated) {
        return Task.findByIdAndUpdate(taskId, { active: false });
      }
      throw new Error('Validation failure');
    });
};

apiModule.activateTask = function (taskId) {
  return Task.findByIdAndUpdate(taskId, { active: true });
};

apiModule.saveFiles = function (number, idFiles, taskId, names) {
  return this.addFile({
    _id: idFiles.input,
    name: names.input,
    url: names.inputUrl,
  })
    .then(() => this.addFile({
      _id: idFiles.output,
      name: names.output,
      url: names.outputUrl,
    }));
};

apiModule.getFileById = function (fileId) {
  return File.findById(fileId, '-_id -name -__v');
};

apiModule.getSubmissionById = function (submissionId) {
  return TaskSubmission.findById(submissionId, '-assignId -mark -submitTime -tests -__v')
    .then(data => this.getFileById(data.srcFileId));
};

apiModule.getPendingTeacher = function (skip, top) {
  return generalApi.getPendingTeacher(skip, top, '-password -role -__v');
};

function getBestSubmissionByAssignment(assignId, submissionProj) {
  return apiModule
    .getSubmissionsByAssignment(assignId, submissionProj)
    .sort('-mark')
    .limit(1);
}

apiModule.getStatistics = function (amount) {
  let students;
  return User
    .find({ role: USER_ROLE_STUDENT }, '_id name surname')
    .lean()
    .then((studs) => {
      students = studs;
      return Promise.all(students.map(el => apiModule.getAllStudentTasks(el._id)));
    })
    .then((tasks) => {
      tasks
        .forEach((el, j) => {
          const withSubmissions = el.filter((elem) => {
            if (elem.submission) {
              return true;
            }
            return false;
          });
          students[j].averageMark = withSubmissions.length ? withSubmissions.reduce(((sum, elem) => sum + elem.submission.mark), 0) : 0;
        });
      students.forEach((el, i) => {
        if (!el.averageMark) {
          students[i].averageMark = 0;
        }
      });
      return students.sort((el1, el2) => el2.averageMark - el1.averageMark).slice(0, amount);
    });
};

module.exports = apiModule;
