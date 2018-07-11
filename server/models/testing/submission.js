const mongoose = require('mongoose');

const { Schema } = mongoose;

const submissionSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  questionsId: { type: [Schema.Types.ObjectId], required: true }, // Can i ref: 'Question' this?
  answeres: { type: Schema.Types.Mixed, required: true },
  completeDate: { type: Date, required: true },
  assignmentId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Assignment' },
  userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;