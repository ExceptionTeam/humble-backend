const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSubmissionSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  assId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'TaskAssignment',
  },
  srcFileId: {
    type: Schema.Types.ObjectId, required: true, ref: 'File',
  },
  tests: [String], // Empty string for passed tests & string with error name in the other case
});

const TaskSubmission = mongoose.model('TaskSubmission', taskSubmissionSchema);
module.exports = { TaskSubmission };
