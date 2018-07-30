const mongoose = require('mongoose');

const SUBMISSION_STATUS_PENDING = 'PENDING';
const SUBMISSION_STATUS_ANSWERED = 'ANSWERED';
const SUBMISSION_STATUS_CHECKED = 'CHECKED';

const { Schema } = mongoose;

const testSubmissionSchema = new Schema({
  questionsId: { type: [{ type: Schema.Types.ObjectId, ref: 'Question' }], index: true, required: true },
  answeres: { type: Schema.Types.Mixed, required: true },
  creationDate: { type: Date, required: true },
  completeDate: { type: Date },
  timeToPass: { type: Number, required: true, default: 1200000 },
  assignmentId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'TestAssignment',
  },
  userId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User',
  },
  status: {
    type: String,
    required: true,
    index: true,
    enum: [SUBMISSION_STATUS_PENDING, SUBMISSION_STATUS_ANSWERED, SUBMISSION_STATUS_CHECKED],
  },
});

const TestSubmission = mongoose.model('TestSubmission', testSubmissionSchema);

module.exports = {
  TestSubmission,
  SUBMISSION_STATUS_PENDING,
  SUBMISSION_STATUS_ANSWERED,
  SUBMISSION_STATUS_CHECKED,
};
