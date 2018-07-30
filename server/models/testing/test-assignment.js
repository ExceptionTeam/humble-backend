const mongoose = require('mongoose');

const { Schema } = mongoose;

const ASSIGNMENT_STATUS_PENDING = 'PENDING';
const ASSIGNMENT_STATUS_PASSED = 'PASSED';
const ASSIGNMENT_STATUS_EXPIRED = 'EXPIRED';

const testAssignmentSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  name: { type: String, required: true },
  tags: { type: [{ type: String }], index: true, required: true },
  assignDate: { type: Date, required: true },
  timeToPass: { type: Number, required: true, default: 1200000 },
  deadline: { type: Date },
  teacherId: {
    type: Schema.Types.ObjectId, required: true, ref: 'User', index: true,
  },
  training: { type: Boolean, required: true, default: true },
  status: {
    type: String,
    required: true,
    index: true,
    enum: [ASSIGNMENT_STATUS_PENDING, ASSIGNMENT_STATUS_PASSED, ASSIGNMENT_STATUS_EXPIRED],
    default: ASSIGNMENT_STATUS_PENDING,
  },
});

const TestAssignment = mongoose.model('TestAssignment', testAssignmentSchema);

module.exports = {
  TestAssignment,
  ASSIGNMENT_STATUS_PENDING,
  ASSIGNMENT_STATUS_PASSED,
  ASSIGNMENT_STATUS_EXPIRED,
};
