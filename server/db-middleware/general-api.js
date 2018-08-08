const mongoose = require('mongoose');
const UserAssignment = require('mongoose').model('UserAssignment');
const {
  User, USER_ROLE_PENDING, USER_ROLE_STUDENT, USER_ROLE_ADMIN, USER_ROLE_TEACHER,
} = require('../models/user/user');
const { University } = require('../models/others/university');
const { Group } = require('../models/user/group');
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

apiModule.changeUserRole = function (userId, newRole) {
  return User
    .findById(userId, 'role')
    .then((user) => {
      if (validateRole(user.role, true) && validateRole(newRole)) {
        const newRoleLevel = (newRole === USER_ROLE_STUDENT) ? 1 : 2;
        const oldRoleLevel = (user.role === USER_ROLE_STUDENT) ? 1 : 2;
        if (oldRoleLevel !== newRoleLevel) {
          return User.findByIdAndUpdate(userId, { role: newRole, account: {} });
        }
        return User.findByIdAndUpdate(userId, { role: newRole });
      }
      return Promise.reject(new Error('Incorrect role'));
    });
};

apiModule.updatePendingTeacher = function (teacherId, isApproved = false) {
  return apiModule.changeUserRole(
    teacherId,
    isApproved ? USER_ROLE_TEACHER : USER_ROLE_STUDENT,
  );
};

apiModule.addStudentToGroup = function (studentId, groupId) {
  return UserAssignment
    .find()
    .exists('studentId')
    .exists('groupId')
    .find({ studentId, groupId })
    .countDocuments()
    .then((amount) => {
      if (!amount) {
        console.log('!');
        return UserAssignment
          .create({
            studentId,
            groupId,
          });
      }
      throw new Error('Already exists');
    });
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
  const result = {};
  return User.find({ role: USER_ROLE_PENDING }, userProj)
    .skip(+skip < 0 ? 0 : +skip)
    .limit(+top <= 0 ? 20 : +top)
    .lean()
    .then((users) => {
      result.teachers = users;
      return User.find({ role: USER_ROLE_PENDING }).countDocuments();
    })
    .then((amount) => {
      result.total = amount;
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

apiModule.getConfigString = function (filterConfig) {
  let configString = '';
  filterConfig.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').split(' ').forEach((el) => {
    if (el !== '') {
      if (configString === '') {
        configString += el;
      } else {
        configString += '|' + el;
      }
    }
  });
  return configString;
};

apiModule.getPersonsCategorized = function (category, skip = 0, top = 10, filterConfig) {
  if (!validateRole(category.toUpperCase())) {
    return Promise.reject();
  }

  const resUsers = {};
  const configString = this.getConfigString(filterConfig);

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

apiModule.getUniversity = function (filterConfig) {
  filterConfig = filterConfig || '';
  const configString = this.getConfigString(filterConfig);

  return University.find({
    $or: [{ name: { $regex: configString, $options: 'i' } }],
  })
    .select('-__v');
};

apiModule.addUserAssignment = function (params) {
  const userAssign = new UserAssignment(params);
  return userAssign.save();
};

apiModule.addGroup = function (params) {
  const group = new Group(params);
  return group.save();
};

apiModule.addIndividualStudent = function (studentId, teacherId) {
  if (!studentId || !teacherId) {
    return Promise.reject();
  }
  return UserAssignment.find({ studentId, teacherId })
    .countDocuments()
    .then((size) => {
      if (size === 0) {
        const params = {
          studentId,
          teacherId,
        };
        return this.addUserAssignment(params);
      }
      return Promise.reject();
    });
};

apiModule.deleteIndividualStudent = function (studentId, teacherId) {
  if (!studentId || !teacherId) {
    return Promise.reject();
  }
  return UserAssignment.find({ studentId, teacherId })
    .countDocuments()
    .then((size) => {
      if (size > 0) {
        return UserAssignment.find({ studentId, teacherId });
      }
      return Promise.reject();
    })
    .then(assignments => Promise.all(assignments.map(el => UserAssignment.findByIdAndRemove(el._id))));
};

apiModule.addGroupToTeacher = function (name, teacherId) {
  const groupId = new mongoose.Types.ObjectId();

  return new Promise((resolve, reject) => {
    Group.find({ name })
      .then((data) => {
        if (data.length !== 0) {
          reject();
        }
      })
      .then(() => {
        resolve();
      });
  })
    .then(() => {
      const params = {
        _id: groupId,
        name,
      };
      return this.addGroup(params);
    })
    .then(() => {
      const params = {
        groupId,
        teacherId,
      };
      return this.addUserAssignment(params);
    });
};

apiModule.deleteGroupAndAssingments = function (groupId) {
  return Group.findByIdAndRemove(groupId)
    .then(() => UserAssignment.find({ groupId }))
    .then(data => Promise.all(data.map(el => UserAssignment.findByIdAndRemove(el._id))));
};

apiModule.editGroup = function (groupId, name) {
  if (!name || !groupId) {
    return Promise.reject();
  }
  return Group.findByIdAndUpdate(groupId, { name });
};

module.exports = apiModule;
