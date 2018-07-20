const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSubmissionSchema = new Schema({
  assignId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'TaskAssignment',
  },
  srcFileId: {
    type: Schema.Types.ObjectId, required: true, ref: 'File',
  },
  mark: {
    type: Number, required: true, min: 0, max: 10,
  },
  submitTime: {
    type: Number, required: true, min: 0,
  },
  tests: Schema.Types.Mixed,
});

const TaskSubmission = mongoose.model('TaskSubmission', taskSubmissionSchema);
module.exports = { TaskSubmission };
