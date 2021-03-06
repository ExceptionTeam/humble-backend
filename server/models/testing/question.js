const mongoose = require('mongoose');

const { Schema } = mongoose;

const CATEGORY_SINGLE_ANSWER = 'SINGLE_ANSWER';
const CATEGORY_MULTIPLE_ANSWERS = 'MULTIPLE_ANSWERS';
const CATEGORY_WORD_ANSWER = 'WORD_ANSWER';
const CATEGORY_SENTENCE_ANSWER = 'SENTENCE_ANSWER';

const TYPE_TRAINING_QUESTION = 'TRAINING';
const TYPE_PRIMARY_QUESTION = 'PRIMARY';

const questionSchema = new Schema({
  section: { type: [{ type: String }], index: true },
  tags: [{ type: String }],
  type: {
    type: String,
    required: true,
    index: true,
    enum: [TYPE_TRAINING_QUESTION, TYPE_PRIMARY_QUESTION],
  },
  active: {
    type: Boolean, required: true, index: true, default: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      CATEGORY_SINGLE_ANSWER,
      CATEGORY_MULTIPLE_ANSWERS,
      CATEGORY_WORD_ANSWER,
      CATEGORY_SENTENCE_ANSWER,
    ],
  },
  question: { type: String, required: true },
  questionAuthorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  answerOptions: Schema.Types.Mixed,
  correctOptions: Schema.Types.Mixed,
  difficulty: {
    type: Number, required: true, min: 1, max: 4,
  },
  peopleTested: { type: Number, required: true, default: 0 },
  peopleAnswered: { type: Number, required: true, default: 0 },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = {
  Question,
  CATEGORY_SINGLE_ANSWER,
  CATEGORY_MULTIPLE_ANSWERS,
  CATEGORY_WORD_ANSWER,
  CATEGORY_SENTENCE_ANSWER,
  TYPE_TRAINING_QUESTION,
  TYPE_PRIMARY_QUESTION,
};
