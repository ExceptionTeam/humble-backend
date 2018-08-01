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
  difficulty: { type: Number, required: true, enum: [1, 2, 3, 4] },
  peopleTested: { type: Number, required: true, default: 0 },
  peopleAnswered: { type: Number, required: true, default: 0 },
});

const Question = mongoose.model('Question', questionSchema);

/*
Question.create({
  tags: ['2', '3', '5'],
  type: TYPE_TRAINING_QUESTION,
  category: CATEGORY_WORD_ANSWER,
  question: 'вопрос 22',
  questionAuthorId: '5b56e7c15497f52b806a9251',
  difficulty: 3,
});
Question.create({
  tags: ['1', '2', '3'],
  type: TYPE_PRIMARY_QUESTION,
  category: CATEGORY_WORD_ANSWER,
  question: 'вопрос 23',
  questionAuthorId: '5b56e7c15497f52b806a9251',
  difficulty: 3,
});
Question.create({
  tags: ['1', '4', '6'],
  type: TYPE_PRIMARY_QUESTION,
  category: CATEGORY_SINGLE_ANSWER,
  question: 'вопрос 24',
  questionAuthorId: '5b56e7c15497f52b806a9251',
  difficulty: 3,
});

Question.create({
  tags: ['1', '2', '3', '5'],
  type: TYPE_PRIMARY_QUESTION,
  category: CATEGORY_MULTIPLE_ANSWERS,
  question: 'вопрос 25',
  questionAuthorId: '5b56e7c15497f52b806a9251',
  difficulty: 4,
});
Question.create({
  tags: ['2', '4', '5'],
  type: TYPE_PRIMARY_QUESTION,
  category: CATEGORY_WORD_ANSWER,
  question: 'вопрос 26',
  questionAuthorId: '5b56e7c15497f52b806a9251',
  difficulty: 2,
});
Question.create({
  tags: ['3', '4', '5'],
  type: TYPE_PRIMARY_QUESTION,
  category: CATEGORY_WORD_ANSWER,
  question: 'вопрос 27',
  questionAuthorId: '5b56e7c15497f52b806a9251',
  difficulty: 1,
});
Question.create({
  tags: ['1', '3', '4'],
  type: TYPE_PRIMARY_QUESTION,
  category: CATEGORY_MULTIPLE_ANSWERS,
  question: 'вопрос 28',
  questionAuthorId: '5b56e7c15497f52b806a9251',
  difficulty: 3,
});
Question.create({
  tags: ['1', '3', '6'],
  type: TYPE_PRIMARY_QUESTION,
  category: CATEGORY_SINGLE_ANSWER,
  question: 'вопрос 29',
  questionAuthorId: '5b56e7c15497f52b806a9251',
  difficulty: 4,
}); */

module.exports = {
  Question,
  CATEGORY_SINGLE_ANSWER,
  CATEGORY_MULTIPLE_ANSWERS,
  CATEGORY_WORD_ANSWER,
  CATEGORY_SENTENCE_ANSWER,
  TYPE_TRAINING_QUESTION,
  TYPE_PRIMARY_QUESTION,
};
