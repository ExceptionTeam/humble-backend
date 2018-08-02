const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema } = mongoose;

const USER_ROLE_STUDENT = 'STUDENT';
const USER_ROLE_TEACHER = 'TEACHER';
const USER_ROLE_ADMIN = 'ADMIN';
const USER_ROLE_PENDING = 'PENDING';

const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  role: {
    type: String,
    required: true,
    uppercase: true,
    enum: [USER_ROLE_STUDENT, USER_ROLE_ADMIN, USER_ROLE_TEACHER, USER_ROLE_PENDING],
  },
  email: { type: String, required: true, unique: true },
  primarySkill: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  account: Schema.Types.Mixed,
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.verifyPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

  return this.hash === hash;
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  USER_ROLE_ADMIN,
  USER_ROLE_STUDENT,
  USER_ROLE_TEACHER,
  USER_ROLE_PENDING,
};
