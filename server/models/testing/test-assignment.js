const mongoose = require('mongoose');

const { Schema } = mongoose;

const ASSIGNMENT_STATUS_PENDING = 'PENDING';
const ASSIGNMENT_STATUS_PASSED = 'PASSED';
const ASSIGNMENT_STATUS_EXPIRED = 'EXPIRED';

const TYPE_TRAINING_TEST = 'TRAINING';
const TYPE_PRIMARY_TEST = 'PRIMARY';

const testAssignmentSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  name: { type: String, required: true },
  tags: { type: [{ type: String }], index: true, required: true },
  assignDate: { type: Date, required: true },
  timeToPass: { type: Number, required: true, default: 1200000 },
  deadline: { type: Date },
  testSize: { type: Number, required: true, default: 20 },
  teacherId: {
    type: Schema.Types.ObjectId, required: true, ref: 'User', index: true,
  },
  trainingPercentage: {
    type: Number, required: true, default: 0.5, min: 0, max: 1,
  },
  type: {
    type: String,
    required: true,
    index: true,
    enum: [TYPE_TRAINING_TEST, TYPE_PRIMARY_TEST],
    default: TYPE_TRAINING_TEST,
  },
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
  TYPE_TRAINING_TEST,
  TYPE_PRIMARY_TEST,
};
