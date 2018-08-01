const { UserAssignment } = require('../models/user/user-assignment');
const {
  User,
  USER_ROLE_ADMIN,
  USER_ROLE_STUDENT,
  USER_ROLE_TEACHER,
  USER_ROLE_PENDING,
} = require('../models/user/user');

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

apiModule.getPendingTeacher = function (skip = 0, top = 10, userProj) {
  return User.find({ role: USER_ROLE_PENDING }, userProj)
    .skip(+skip < 0 ? 0 : +skip)
    .limit(+top <= 0 ? 5 : +top)
    .lean();
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

apiModule.getStudentsByTeacherFlat = function (teacherId) {
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

module.exports = apiModule;
