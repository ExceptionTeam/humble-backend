const mongoose = require('mongoose');

const { Schema } = mongoose;

const testAssignmentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  name: { type: String, required: true },
  tags: { type: [{ type: String }], index: true, required: true },
  assignDate: { type: Date, required: true },
  teacherId: {
    type: Schema.Types.ObjectId, required: true, ref: 'User', index: true,
  },
});

const TestAssignment = mongoose.model('TestAssignment', testAssignmentSchema);

module.exports = { TestAssignment };
