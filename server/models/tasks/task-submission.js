const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSubmissionSchema = new Schema({
  assId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'TaskAssignment',
  },
  srcFileId: {
    type: Schema.Types.ObjectId, required: true, ref: 'File',
  },
  tests: Schema.Types.Mixed,
});

const TaskSubmission = mongoose.model('TaskSubmission', taskSubmissionSchema);
module.exports = { TaskSubmission };
