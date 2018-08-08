const mongoose = require('mongoose');

const { Schema } = mongoose;

const REQUEST_STATUS_PENDING = 'PENDING';
const REQUEST_STATUS_CHECKED = 'CHECKED';


const checkRequestSchema = new Schema({
  teacherId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User',
  },
  studentId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User',
  },
  assignmentId: { type: Schema.Types.ObjectId, ref: 'TestAssignment', index: true },
  submissionId: { type: Schema.Types.ObjectId, ref: 'TestSubmission', index: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', index: true },
  answer: { type: String, required: true },
  status: {
    type: String,
    required: true,
    index: true,
    enum: [REQUEST_STATUS_PENDING, REQUEST_STATUS_CHECKED],
    default: REQUEST_STATUS_PENDING,
  },
  result: { type: Boolean },
  checkDate: { type: Number, min: 0 },
});

const CheckRequest = mongoose.model('CheckRequest', checkRequestSchema);

module.exports = {
  CheckRequest,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_CHECKED,
};
