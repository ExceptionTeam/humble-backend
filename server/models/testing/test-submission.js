const mongoose = require('mongoose');

const { Schema } = mongoose;

const testSubmissionSchema = new Schema({
  questionsId: { type: [{ type: Schema.Types.ObjectId, ref: 'Question' }], index: true, required: true },
  answeres: { type: Schema.Types.Mixed, required: true },
  completeDate: { type: Date, required: true },
  assignmentId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'TestAssignment',
  },
  userId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User',
  },
});

const TestSubmission = mongoose.model('TestSubmission', testSubmissionSchema);

module.exports = { TestSubmission };
