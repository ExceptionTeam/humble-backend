const { TaskAssignment } = require('../models/tasks/task-assignment');
const { Task } = require('../models/tasks/task');
const { UserAssignment } = require('../models/user/user-assignment');
const { TaskSubmission } = require('../models/tasks/task-submission');
const { User, USER_ROLE_TEACHER, USER_ROLE_STUDENT } = require('../models/user/user');


module.exports = function (app, db) {
  const module = {};

  module.getAllTasks = function () {
    return Task
      .find()
      .select('-inputFilesId -outputFilesId -tags -successfulAttempts -attempts -description -__v')
      .exec();
  };

  module.getAssignmentById = function (assId, assProj, taskProj, teacProj, studProj) {
    return TaskAssignment
      .findById(assId, assProj /* '-_id -studentId -__v' */)
      .populate('taskId', taskProj /* 'name description weight -_id' */)
      .populate('teacherId', teacProj /* 'name surname -_id' */)
      .populate('studentId', studProj);
  };

  module.addTask = function(){
    /* const ass = new User({
       name: 'Zhanna',
       surname: 'Vasilenko',
       password: '123512412',
       role: 'STUDENT',
       account: 'a',
     });*/
    /*  const ass = new TaskAssignment({
        taskId: new db.Types.ObjectId,
        deadline: 1241412,
        teacherId: new db.Types.ObjectId,
        studentId: "5b445f245994e12e04b32e46",
      });*/
      const ass = new TaskSubmission({
        assId: "5b4cb4cf4fe573302c8af822",
        srcFileId: new db.Types.ObjectId,
        tests: 'a',
      });
      ass.save();
    };

    const getAssignmentsByStudent = function(studId){
      return TaskAssignment
      .find({studentId: studId})
      .select('-__v -studentId -deadline')
      .populate('taskId', '-inputFilesId -outputFilesId -tags -successfulAttempts -_id -__v -description')
      .populate('teacherId', '-_id -password -role -account -__v')
      .then((assignments) => {return assignments;})
    };

    const getSubmissionsByAssignments = function(studAssignment){
      return TaskSubmission
      .find({assId: {$in: studAssignment}})
      .select('-__v')
    };

    module.getAllStudentTasks = async function(studId){
        const result = {
          resolved: [],
          appointed: [],
        };
        return getAssignmentsByStudent(studId)
          .then((assignments) => {
            result.resolved = assignments;
          })
          .then(() => getSubmissionsByAssignments(result.resolved))
          .then((submissions) => {
            result.appointed = submissions;
          })
          .then(()=> result);
  };

  return module;
};
