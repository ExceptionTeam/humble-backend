const mongoose = require('mongoose');


// DO WE REALLY NEED THIS SCHEMA, CAUSE WE CAN USE TEACHER-ASSIGNMENT FOR THIS CASE TOOOOOOOO


const { Schema } = mongoose;

const studentAssignmentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  studentId: { type: Schema.Types.ObjectId, required: true },
  groupId: { type: Schema.Types.ObjectId, required: true },
});

const StudentAssignment = mongoose.model('StudentAssignment', studentAssignmentSchema);

module.exports = StudentAssignment;