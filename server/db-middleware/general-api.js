const UserAssignment = require('mongoose').model('UserAssignment');
const {
  User, USER_ROLE_PENDING, USER_ROLE_STUDENT, USER_ROLE_ADMIN, USER_ROLE_TEACHER,
} = require('../models/user/user');
const generatePassword = require('password-generator');
const mailer = require('../controllers/mailer');


const apiModule = {};

apiModule.isTeacher = function (user) {
  return user.role.toUpperCase() === USER_ROLE_TEACHER;
};

apiModule.isStudent = function (user) {
  return user.role.toUpperCase() === USER_ROLE_STUDENT ||
    user.role.toUpperCase() === USER_ROLE_PENDING;
};

apiModule.isAdmin = function (user) {
  return user.role.toUpperCase() === USER_ROLE_ADMIN;
};

function addUser(userData) {
  const newUser = new User(userData);
  const password = generatePassword(8, false);
  newUser.setPassword(password);
  return newUser
    .save()
    .then(() => {
      mailer.sendMail(
        userData.email,
        'Добро пожаловать на портал Exception',
        `Вы были успешно зарегистрированы на портале Exception.\nВаши данные для входа:\n
        \tЛогин: ${userData.email}\n
        \tПароль: ${password}`,
      );
    });
}

apiModule.changePassword = function (userId, oldPass, newPass) {
  return User
    .findById(userId)
    .then((user) => {
      if (user.verifyPassword(oldPass)) {
        return user;
      }
      throw new Error();
    })
    .then((user) => {
      const { email } = user;
      mailer.sendMail(
        email,
        'Смена пароля',
        'Здравствуйте, ваш пароль был успешно изменен.',
      );
      user.setPassword(newPass);
      user.markModified('hash');
      user.markModified('salt');
      return user.save();
    });
};

apiModule.resetPassword = function (email) {
  return User
    .findOne({ email })
    .then((user) => {
      if (user) {
        const password = generatePassword(8, false);
        mailer.sendMail(
          email,
          'Сброс пароля',
          `Здравствуйте, на вашем аккаунте была задействована функция сброса пароля.\nНовый пароль: ${password}`,
        );
        user.setPassword(password);
        user.markModified('hash');
        user.markModified('salt');
        user.save();
      }
    });
};

apiModule.addNewStudent = function (userData) {
  const {
    name, surname, email, account, primarySkill,
  } = userData;
  return addUser({
    name, surname, email, account, primarySkill, role: USER_ROLE_STUDENT,
  });
};

apiModule.addNewTeacher = function (userData) {
  const {
    name, surname, email, account, primarySkill,
  } = userData;
  return addUser({
    name, surname, email, account, primarySkill, role: USER_ROLE_PENDING,
  });
};

function validateRole(role, withPending = false) {
  if (role === USER_ROLE_STUDENT ||
    role === USER_ROLE_TEACHER ||
    role === USER_ROLE_ADMIN ||
    (withPending ? role === USER_ROLE_PENDING : false)) {
    return true;
  }
  return false;
}

apiModule.changeUserRole = function (userId, oldRole, newRole) {
  if (validateRole(oldRole, true) && validateRole(newRole)) {
    const newRoleLevel = (newRole === USER_ROLE_STUDENT) ? 1 : 2;
    const oldRoleLevel = (oldRole === USER_ROLE_STUDENT) ? 1 : 2;
    if (oldRoleLevel !== newRoleLevel) {
      return User.findByIdAndUpdate(userId, { role: newRole, account: {} });
    }
    return User.findByIdAndUpdate(userId, { role: newRole });
  }
  return Promise.reject(new Error('Incorrect role'));
};

apiModule.updatePendingTeacher = function (teacherId, isApproved = false) {
  return apiModule.changeUserRole(
    teacherId,
    USER_ROLE_PENDING,
    isApproved ? USER_ROLE_TEACHER : USER_ROLE_STUDENT,
  );
};

apiModule.removeStudentFromGroup = function (studentId, groupId) {
  return UserAssignment.findOneAndRemove({ studentId, groupId });
};

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

apiModule.getPendingTeachers = function (skip = 0, top = 20, userProj) {
  return User.find({ role: USER_ROLE_PENDING }, userProj)
    .skip(+skip < 0 ? 0 : +skip)
    .limit(+top <= 0 ? 20 : +top)
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

apiModule.getGroupIdsByStudent = function (studentId) {
  return UserAssignment
    .find({ studentId })
    .exists('groupId')
    .select('groupId')
    .then(userAssignment => userAssignment.map(el => el.groupId));
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

apiModule.getPersonsCategorized = function (category, skip = 0, top = 10, filterConfig) {
  const resUsers = {};
  let configString = '';

  if (!validateRole(category.toUpperCase())) {
    return Promise.reject();
  }

  filterConfig.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').split(' ').forEach((el, i) => {
    if (el !== '') {
      if (configString === '') {
        configString += el;
      } else {
        configString += '|' + el;
      }
    }
  });

  return User.find({ role: category.toUpperCase() })
    .find({
      $or: [{ name: { $regex: configString, $options: 'i' } },
        { surname: { $regex: configString, $options: 'i' } },
        { 'account.university': { $regex: configString, $options: 'i' } }],
    })
    .select('-__v -role -email -primarySkill -hash -salt')
    .skip(+skip < 0 ? 0 : +skip)
    .limit(+top <= 0 ? 10 : +top)
    .then((users) => {
      resUsers.data = users;
      return User.find({ role: category.toUpperCase() })
        .countDocuments();
    })
    .then((total) => {
      resUsers.pagination = { total };
      return User.find({ role: category.toUpperCase() })
        .find({
          $or: [{ name: { $regex: configString, $options: 'i' } },
            { surname: { $regex: configString, $options: 'i' } },
            { 'account.university': { $regex: configString, $options: 'i' } }],
        })
        .countDocuments();
    })
    .then((filtered) => {
      resUsers.pagination.filtered = filtered;
      return resUsers;
    });
};

module.exports = apiModule;
