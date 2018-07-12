const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskAssignmentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  taskId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'Task',
  },
  deadline: { type: Number, required: true, min: 0 },
  teacherId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User',
  },
  studentId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User',
  },
});

const TaskAssignment = mongoose.model('TaskAssignment', taskAssignmentSchema);
module.exports = { TaskAssignment };
