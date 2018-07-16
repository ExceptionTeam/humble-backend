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

  module.getStudentsByTeacher = async function (teachId) {
    const result = {
      individualStudents: [],
      groups: [],
    };
    result.individualStudents = await getIndividualStudents(teachId, 'name surname');
    result.groups = await this.getGroupsByTeacher(teachId, '-__v');
    const promises = result.groups.map(elem => this.getStudentsByGroup(elem.groupId._id, 'name surname'));
    return Promise.all(promises)
      .then((results) => {
        for (let i = 0; i < result.groups.length; i++) {
          result.groups[i].groupStudents = results[i];
        }
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
