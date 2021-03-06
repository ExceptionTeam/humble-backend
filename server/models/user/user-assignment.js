const mongoose = require('mongoose');

const { Schema } = mongoose;

const userAssignmentSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId, index: true, ref: 'User',
  },
  groupId: {
    type: Schema.Types.ObjectId, index: true, ref: 'Group',
  },
  teacherId: {
    type: Schema.Types.ObjectId, index: true, ref: 'User',
  },
});

const UserAssignment = mongoose.model('UserAssignment', userAssignmentSchema);

module.exports = { UserAssignment };
