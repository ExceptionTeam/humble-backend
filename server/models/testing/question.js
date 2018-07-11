const mongoose = require('mongoose');

const { Schema } = mongoose;

const questionSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  section: { type: [String], required: true }, // should it be indexed?
  tags: [String], // should it be indexed?
  type: { type: String, required: true },
  category: { type: String, required: true }, // Should it be enum'ed?
  question: { type: String, required: true }, // Should it be enum'ed?
  questionAuthorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  answerOptions: Schema.Types.Mixed,
  correctOptions: Schema.Types.Mixed,
  difficulty: { type: Number, required: true },
  peopleTested: { type: Number, required: true, default: 0 },
  peopleAnswered: { type: Number, required: true, default: 0 },
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
