const { UserAssignment } = require('../models/user/user-assignment');

const apiModule = {};

apiModule.getIndividualStudents = function (teachId, studProj) {
  return UserAssignment
    .find({ teacherId: teachId })
    .exists('studentId')
    .select('-_id -teacherId -__v')
    .populate('studentId', studProj)
    .lean();
};

apiModule.getStudentsByTeacher = function (teacherId) {
  const result = {
    individualStudents: [],
    groups: [],
  };
  return apiModule.getIndividualStudents(teacherId, 'name surname')
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


apiModule.getGroupsByTeacher = function (teacherId, groupProj) {
  return UserAssignment
    .find({ teacherId })
    .exists('groupId')
    .select('-_id -teacherId -__v')
    .populate('groupId', groupProj)
    .lean();
};

apiModule.getGroupsByStudent = function (studentId, groupProj) {
  return UserAssignment
    .find({ studentId })
    .exists('groupId')
    .select('-_id -studentId -__v')
    .populate('groupId', groupProj)
    .lean();
};

apiModule.getStudentsByGroup = function (groupId, studProj) {
  return UserAssignment
    .find({ groupId })
    .exists('studentId')
    .select('-_id -groupId -__v')
    .populate('studentId', studProj)
    .lean();
};

apiModule.getFilteredStudentsByTeacher = function (teacherId) {
  let allids = [];
  const allKeys = {};
  return apiModule.getStudentsByTeacher(teacherId)
    .then((userId) => {
      allids = userId.individualStudents;
      return userId.groups;
    })
    .then(allGroups => allGroups.forEach(group => group.groupStudents.forEach((id) => {
      allids.push(id);
    })))
    .then(() => allids.forEach((stdId) => {
      const str = stdId._id;
      allKeys[str] = true;
    }))
    .then(() => Object.keys(allKeys));
};

console.log('\n \n \n');
console.log(apiModule.getFilteredStudentsByTeacher('5b56e7c15497f52b806a9246'));

module.exports = apiModule;
