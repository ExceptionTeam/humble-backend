const mongoose = require('mongoose');

const { Schema } = mongoose;

const teacherAssignmentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  studentId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
  groupId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Group' },
  teacherId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
});

const TeacherAssignment = mongoose.model('TeacherAssignment', teacherAssignmentSchema);

module.exports = TeacherAssignment;