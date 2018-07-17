const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSchema = new Schema({
  inputFilesId: {
    type: [{ type: Schema.Types.ObjectId, ref: 'File' }],
    index: true,
    required: true,
  },
  outputFilesId: {
    type: [{ type: Schema.Types.ObjectId, ref: 'File' }],
    index: true,
    required: true,
  },
  tags: [String],
  name: { type: String, required: true },
  description: { type: String, required: true },
  weight: {
    type: Number, required: true, min: 0, max: 10,
  },
  successfulAttempts: {
    type: Number, required: true, default: 0, min: 0,
  },
  attempts: {
    type: Number, required: true, default: 0, min: 0,
  },
  active: {
    type: Boolean, required: true, default: true,
  },
});

const Task = mongoose.model('Task', taskSchema);
module.exports = { Task };
