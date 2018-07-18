const { UserAssignment } = require('../models/user/user-assignment');
require('../models/user/group');

module.exports = function (app, db) {
  const module = {};

  const getIndividualStudents = function (teachId, studProj) {
    return UserAssignment
      .find({ teacherId: teachId })
      .exists('studentId')
      .select('-_id -teacherId -__v')
      .populate('studentId', studProj)
      .lean();
  };

  module.getStudentsByTeacher = function (teacherId) {
    const result = {
      individualStudents: [],
      groups: [],
    };
    return getIndividualStudents(teacherId, 'name surname')
      .then((individualStudents) => {
        result.individualStudents = individualStudents.map(el => el.studentId);
      })
      .then(() => this.getGroupsByTeacher(teacherId, '-__v'))
      .then((groups) => {
        result.groups = groups.map(el => el.groupId);
      })
      .then(() => Promise.all(result.groups.map(elem => this.getStudentsByGroup(elem._id, 'name surname'))))
      .then((studentsGroup) => {
        studentsGroup.forEach((el, i) => {
          result.groups[i].groupStudents = el.map(stud => stud.studentId);
        });
        return result;
      });
  };


  module.getGroupsByTeacher = function (teacherId, groupProj) {
    return UserAssignment
      .find({ teacherId })
      .exists('groupId')
      .select('-_id -teacherId -__v')
      .populate('groupId', groupProj)
      .lean();
  };

  module.getStudentsByGroup = function (groupId, studProj) {
    return UserAssignment
      .find({ groupId })
      .exists('studentId')
      .select('-_id -groupId -__v')
      .populate('studentId', studProj)
      .lean();
  };


  return module;
};
