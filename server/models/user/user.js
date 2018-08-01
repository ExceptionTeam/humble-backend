const mongoose = require('mongoose');

const { Schema } = mongoose;

const USER_ROLE_STUDENT = 'STUDENT';
const USER_ROLE_TEACHER = 'TEACHER';
const USER_ROLE_ADMIN = 'ADMIN';
const USER_ROLE_PENDING = 'PENDING';

const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    uppercase: true,
    enum: [USER_ROLE_STUDENT, USER_ROLE_ADMIN, USER_ROLE_TEACHER, USER_ROLE_PENDING],
  },
  account: Schema.Types.Mixed,
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  USER_ROLE_ADMIN,
  USER_ROLE_STUDENT,
  USER_ROLE_TEACHER,
  USER_ROLE_PENDING,
};
