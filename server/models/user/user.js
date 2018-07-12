const mongoose = require('mongoose');

const { Schema } = mongoose;

const USER_ROLE_STUDENT = 'STUDENT';
const USER_ROLE_TEACHER = 'TEACHER';
const USER_ROLE_ADMIN = 'ADMIN';

const userSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String, required: true, uppercase: true, enum: ['STUDENT', 'ADMIN', 'TEACHER'],
  },
  account: Schema.Types.Mixed,
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  USER_ROLE_ADMIN,
  USER_ROLE_STUDENT,
  USER_ROLE_TEACHER,
};
