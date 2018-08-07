const mongoose = require('mongoose');

const SUBMISSION_STATUS_PENDING = 'PENDING';
const SUBMISSION_STATUS_ANSWERED = 'ANSWERED';
const SUBMISSION_STATUS_CHECKED = 'CHECKED';
const SUBMISSION_STATUS_EVALUATED = 'EVALUATED';

const { Schema } = mongoose;

const testSubmissionSchema = new Schema({
  questionsId: { type: [{ type: Schema.Types.ObjectId, ref: 'Question' }], index: true, required: true },
  answers: { type: Schema.Types.Mixed },
  creationDate: { type: Number, required: true, min: 0 },
  completeDate: { type: Number, min: 0 },
  timeToPass: { type: Number, required: true, default: 1200000 },
  assignmentId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'TestAssignment',
  },
  userId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User',
  },
  teacherId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User',
  },
  status: {
    type: String,
    required: true,
    index: true,
    enum: [SUBMISSION_STATUS_PENDING,
      SUBMISSION_STATUS_ANSWERED,
      SUBMISSION_STATUS_CHECKED,
      SUBMISSION_STATUS_EVALUATED],
  },
  mark: { type: Number },
});

const TestSubmission = mongoose.model('TestSubmission', testSubmissionSchema);

module.exports = {
  TestSubmission,
  SUBMISSION_STATUS_PENDING,
  SUBMISSION_STATUS_ANSWERED,
  SUBMISSION_STATUS_CHECKED,
  SUBMISSION_STATUS_EVALUATED,
};
