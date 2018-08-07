const {
  TestAssignment,
  ASSIGNMENT_STATUS_PASSED,
  TYPE_PRIMARY_TEST,
  TYPE_TRAINING_TEST,
} = require('../models/testing/test-assignment');
const {
  TestSubmission,
  SUBMISSION_STATUS_PENDING,
  SUBMISSION_STATUS_ANSWERED,
  SUBMISSION_STATUS_CHECKED,
  SUBMISSION_STATUS_EVALUATED,
} = require('../models/testing/test-submission');
const {
  Question,
  CATEGORY_SINGLE_ANSWER,
  CATEGORY_MULTIPLE_ANSWERS,
  CATEGORY_WORD_ANSWER,
  CATEGORY_SENTENCE_ANSWER,
  TYPE_TRAINING_QUESTION,
  TYPE_PRIMARY_QUESTION,
} = require('../models/testing/question');
const {
  TagAttachment,
} = require('../models/testing/tag-attachment');
const {
  CheckRequest,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_CHECKED,
} = require('../models/testing/check-request');

const apiModule = {};

apiModule.getQuestionsByTags = function (questionTags = null, skip = 0, top = 20) {
  const questions = {};
  questions.amount = 0;
  questions.subs = [];
  if (questionTags === null) {
    return Question
      .find()
      .skip(+skip < 0 ? 0 : +skip)
      .limit(+top <= 0 ? 20 : +top)
      .lean()
      .then((quest) => {
        questions.subs = quest;
        return Question
          .countDocuments();
      })
      .then((amount) => {
        questions.amount = amount;
        return questions;
      });
  }
  return Question
    .find({
      tags: { $in: questionTags.split(', ') },
    })
    .skip(+skip < 0 ? 0 : +skip)
    .limit(+top <= 0 ? 20 : +top)
    .lean()
    .then((quest) => {
      questions.subs = quest;
      return Question
        .countDocuments();
    })
    .then((amount) => {
      questions.amount = amount;
      return questions;
    });
};

apiModule.getAllTagAttachments = function () {
  return TagAttachment
    .find()
    .populate('sectionId');
};


apiModule.getQuestionsAndSort = function (questionTags, questionType) {
  const questions = {};
  questions.d1c1t = []; questions.d1c1x = []; questions.d1c2t = []; questions.d1c2x = [];
  questions.d1c3t = []; questions.d1c3x = []; questions.d2c1t = []; questions.d2c1x = [];
  questions.d2c2t = []; questions.d2c2x = []; questions.d2c3t = []; questions.d2c3x = [];
  questions.d3c1t = []; questions.d3c1x = []; questions.d3c2t = []; questions.d3c2x = [];
  questions.d3c3t = []; questions.d3c3x = []; questions.d4c1t = []; questions.d4c1x = [];
  questions.d4c2t = []; questions.d4c2x = []; questions.d4c3t = []; questions.d4c3x = [];
  return Question
    .find({
      tags: { $in: questionTags }, active: true, type: { $in: questionType },
    })
    .select('_id difficulty category type')
    .then((questionsUnsorted) => {
      const compareRandom = function (a, b) {
        return Math.random() - 0.5;
      };
      return questionsUnsorted.sort(compareRandom);
    })
    .then((questionsUnsorted) => {
      questionsUnsorted.forEach((el) => {
        if (el.difficulty === 1 && el.category === CATEGORY_SINGLE_ANSWER &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d1c1x.push(el._id);
        } else if (el.difficulty === 1 && el.category === CATEGORY_MULTIPLE_ANSWERS &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d1c2x.push(el._id);
        } else if (el.difficulty === 1 && el.category === CATEGORY_WORD_ANSWER &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d1c3x.push(el._id);
        } else if (el.difficulty === 2 && el.category === CATEGORY_SINGLE_ANSWER &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d2c1x.push(el._id);
        } else if (el.difficulty === 2 && el.category === CATEGORY_MULTIPLE_ANSWERS &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d2c2x.push(el._id);
        } else if (el.difficulty === 2 && el.category === CATEGORY_WORD_ANSWER &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d2c3x.push(el._id);
        } else if (el.difficulty === 3 && el.category === CATEGORY_SINGLE_ANSWER &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d3c1x.push(el._id);
        } else if (el.difficulty === 3 && el.category === CATEGORY_MULTIPLE_ANSWERS &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d3c2x.push(el._id);
        } else if (el.difficulty === 3 && el.category === CATEGORY_WORD_ANSWER &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d3c3x.push(el._id);
        } else if (el.difficulty === 4 && el.category === CATEGORY_SINGLE_ANSWER &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d4c1x.push(el._id);
        } else if (el.difficulty === 4 && el.category === CATEGORY_MULTIPLE_ANSWERS &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d4c2x.push(el._id);
        } else if (el.difficulty === 4 && el.category === CATEGORY_WORD_ANSWER &&
          el.type === TYPE_PRIMARY_QUESTION) {
          questions.d4c3x.push(el._id);
        } else if (el.difficulty === 1 && el.category === CATEGORY_SINGLE_ANSWER &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d1c1t.push(el._id);
        } else if (el.difficulty === 1 && el.category === CATEGORY_MULTIPLE_ANSWERS &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d1c2t.push(el._id);
        } else if (el.difficulty === 1 && el.category === CATEGORY_WORD_ANSWER &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d1c3t.push(el._id);
        } else if (el.difficulty === 2 && el.category === CATEGORY_SINGLE_ANSWER &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d2c1t.push(el._id);
        } else if (el.difficulty === 2 && el.category === CATEGORY_MULTIPLE_ANSWERS &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d2c2t.push(el._id);
        } else if (el.difficulty === 2 && el.category === CATEGORY_WORD_ANSWER &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d2c3t.push(el._id);
        } else if (el.difficulty === 3 && el.category === CATEGORY_SINGLE_ANSWER &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d3c1t.push(el._id);
        } else if (el.difficulty === 3 && el.category === CATEGORY_MULTIPLE_ANSWERS &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d3c2t.push(el._id);
        } else if (el.difficulty === 3 && el.category === CATEGORY_WORD_ANSWER &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d3c3t.push(el._id);
        } else if (el.difficulty === 4 && el.category === CATEGORY_SINGLE_ANSWER &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d4c1t.push(el._id);
        } else if (el.difficulty === 4 && el.category === CATEGORY_MULTIPLE_ANSWERS &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d4c2t.push(el._id);
        } else if (el.difficulty === 4 && el.category === CATEGORY_WORD_ANSWER &&
          el.type === TYPE_TRAINING_QUESTION) {
          questions.d4c3t.push(el._id);
        }
      });
    })
    .then(() => questions);
};

const getCaseNumber = function (
  caseAvailable,
  byDifficulty,
  byCat,
  byType,
  diffBool,
  catBool,
  typeBool,
) {
  let caseNumber = -1;

  const checkConditions = function (diff, cat, type, caseNum) {
    if (
      ((byCat[cat] <= byCat[0]) || !catBool[0]) &&
      ((byCat[cat] <= byCat[1]) || !catBool[1]) &&
      ((byCat[cat] <= byCat[2]) || !catBool[2]) &&
      ((byDifficulty[diff] <= byDifficulty[0]) || !diffBool[0]) &&
      ((byDifficulty[diff] <= byDifficulty[1]) || !diffBool[1]) &&
      ((byDifficulty[diff] <= byDifficulty[2]) || !diffBool[2]) &&
      ((byDifficulty[diff] <= byDifficulty[3]) || !diffBool[3]) &&
      ((byType[type] <= byType[0]) || !typeBool[0]) &&
      ((byType[type] <= byType[1]) || !typeBool[1]) &&
      caseAvailable[caseNum]) return true;
    return false;
  };

  if (checkConditions(0, 0, 0, 0)) caseNumber = 0;
  else if (checkConditions(0, 0, 1, 1)) caseNumber = 1;
  else if (checkConditions(0, 1, 0, 2)) caseNumber = 2;
  else if (checkConditions(0, 1, 1, 3)) caseNumber = 3;
  else if (checkConditions(0, 2, 0, 4)) caseNumber = 4;
  else if (checkConditions(0, 2, 1, 5)) caseNumber = 5;
  else if (checkConditions(1, 0, 0, 6)) caseNumber = 6;
  else if (checkConditions(1, 0, 1, 7)) caseNumber = 7;
  else if (checkConditions(1, 1, 0, 8)) caseNumber = 8;
  else if (checkConditions(1, 1, 1, 9)) caseNumber = 9;
  else if (checkConditions(1, 2, 0, 10)) caseNumber = 10;
  else if (checkConditions(1, 2, 1, 11)) caseNumber = 11;
  else if (checkConditions(2, 0, 0, 12)) caseNumber = 12;
  else if (checkConditions(2, 0, 1, 13)) caseNumber = 13;
  else if (checkConditions(2, 1, 0, 14)) caseNumber = 14;
  else if (checkConditions(2, 1, 1, 15)) caseNumber = 15;
  else if (checkConditions(2, 2, 0, 16)) caseNumber = 16;
  else if (checkConditions(2, 2, 1, 17)) caseNumber = 17;
  else if (checkConditions(3, 0, 0, 18)) caseNumber = 18;
  else if (checkConditions(3, 0, 1, 19)) caseNumber = 19;
  else if (checkConditions(3, 1, 0, 20)) caseNumber = 20;
  else if (checkConditions(3, 1, 1, 21)) caseNumber = 21;
  else if (checkConditions(3, 2, 0, 22)) caseNumber = 22;
  else if (checkConditions(3, 2, 1, 23)) caseNumber = 23;

  else if (caseAvailable[23]) caseNumber = 23;
  else if (caseAvailable[22]) caseNumber = 22;
  else if (caseAvailable[21]) caseNumber = 21;
  else if (caseAvailable[20]) caseNumber = 20;
  else if (caseAvailable[19]) caseNumber = 19;
  else if (caseAvailable[18]) caseNumber = 18;
  else if (caseAvailable[17]) caseNumber = 17;
  else if (caseAvailable[16]) caseNumber = 16;
  else if (caseAvailable[15]) caseNumber = 15;
  else if (caseAvailable[14]) caseNumber = 14;
  else if (caseAvailable[13]) caseNumber = 13;
  else if (caseAvailable[12]) caseNumber = 12;
  else if (caseAvailable[11]) caseNumber = 11;
  else if (caseAvailable[10]) caseNumber = 10;
  else if (caseAvailable[9]) caseNumber = 9;
  else if (caseAvailable[8]) caseNumber = 8;
  else if (caseAvailable[7]) caseNumber = 7;
  else if (caseAvailable[6]) caseNumber = 6;
  else if (caseAvailable[5]) caseNumber = 5;
  else if (caseAvailable[4]) caseNumber = 4;
  else if (caseAvailable[3]) caseNumber = 3;
  else if (caseAvailable[2]) caseNumber = 2;
  else if (caseAvailable[1]) caseNumber = 1;
  else if (caseAvailable[0]) caseNumber = 0;

  return caseNumber;
};

apiModule.getQuestionsToSubmit = function (questionTags, testType, questionAmount, trPart) {
  const amountByDiff = [0, 0, 0, 0];
  const amountByCat = [0, 0, 0];
  const amountByType = [0, 0];
  const questionIdToSub = [];
  let questLeftToAdd = questionAmount;
  let flag = true;
  let completed = false;
  let caseAvailable;
  let typeBool;
  let questionsInTheEnd;
  if (testType === TYPE_TRAINING_TEST) {
    caseAvailable =
    [true, false, true, false, true, false, true, false, true, false, true, false,
      true, false, true, false, true, false, true, false, true, false, true, false];
    typeBool = [true, false];
  } else if (testType === TYPE_PRIMARY_TEST) {
    caseAvailable =
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true,
      true, true, true, true, true, true, true, true, true, true, true, true, true, true];
    typeBool = [true, true];
  }
  const diffBool = [true, true, true, true];
  const catBool = [true, true, true];

  const checkIfAvailable = function () {
    if (!(caseAvailable[0] && caseAvailable[1] && caseAvailable[2]
    && caseAvailable[3] && caseAvailable[4] && caseAvailable[5])) diffBool[0] = false;
    else if (!(caseAvailable[6] && caseAvailable[7] && caseAvailable[8]
      && caseAvailable[9] && caseAvailable[10] && caseAvailable[11])) diffBool[1] = false;
    else if (!(caseAvailable[12] && caseAvailable[13] && caseAvailable[14]
      && caseAvailable[15] && caseAvailable[16] && caseAvailable[17])) diffBool[2] = false;
    else if (!(caseAvailable[18] && caseAvailable[19] && caseAvailable[20]
      && caseAvailable[21] && caseAvailable[22] && caseAvailable[23])) diffBool[3] = false;

    if (!(caseAvailable[0] && caseAvailable[1] && caseAvailable[6] && caseAvailable[7] &&
      caseAvailable[12] && caseAvailable[13] && caseAvailable[18] && caseAvailable[19])) {
      catBool[0] = false;
    } else if (!(caseAvailable[2] && caseAvailable[3] && caseAvailable[8] && caseAvailable[9] &&
      caseAvailable[14] && caseAvailable[15] && caseAvailable[20] && caseAvailable[21])) {
      catBool[1] = false;
    } else if (!(caseAvailable[4] && caseAvailable[5] && caseAvailable[10] && caseAvailable[11] &&
      caseAvailable[16] && caseAvailable[17] && caseAvailable[22] && caseAvailable[23])) {
      catBool[2] = false;
    }

    if (!(caseAvailable[0] && caseAvailable[2] && caseAvailable[4] &&
      caseAvailable[6] && caseAvailable[8] && caseAvailable[10] &&
      caseAvailable[12] && caseAvailable[14] && caseAvailable[16] &&
      caseAvailable[18] && caseAvailable[20] && caseAvailable[22])) typeBool[0] = false;
    else if (!(caseAvailable[1] && caseAvailable[3] && caseAvailable[5] &&
      caseAvailable[7] && caseAvailable[9] && caseAvailable[11] &&
      caseAvailable[13] && caseAvailable[15] && caseAvailable[17] &&
      caseAvailable[19] && caseAvailable[21] && caseAvailable[23])) typeBool[1] = false;
  };

  let caseNumber;
  let availableQuestions;
  let questionType;
  if (testType === TYPE_TRAINING_TEST) {
    questionType = [TYPE_TRAINING_QUESTION];
  } else if (testType === TYPE_PRIMARY_TEST) {
    questionType = [TYPE_TRAINING_QUESTION, TYPE_PRIMARY_QUESTION];
  }
  return Question.find({
    tags: { $in: questionTags },
    active: true,
    category: CATEGORY_SENTENCE_ANSWER,
    type: { $in: questionType },
  })
    .select('_id')
    .then(toChoose => toChoose[Math.floor(Math.random() * toChoose.length)])
    .then((buffer) => {
      if (buffer !== null) {
        questionsInTheEnd = buffer._id;
        amountByDiff[buffer.difficulty - 1]++;
        if (amountByType === TYPE_TRAINING_QUESTION) {
          amountByType[0] += trPart;
        } else {
          amountByType[1] += 1 - trPart;
        }
        questLeftToAdd--;
      } else questionsInTheEnd = null;
    })
    .then(() => apiModule.getQuestionsAndSort(questionTags, questionType))
    .then((buffer) => {
      availableQuestions = buffer;
    })
    .then(() => Object.keys(availableQuestions))
    .then((keys) => {
      keys.forEach((key, index) => {
        if (availableQuestions[key].length === 0) {
          caseAvailable[index] = false;
        }
      });
    })
    .then(() => {
      checkIfAvailable();
    })

    .then(() => {
      while (flag) {
        caseNumber = getCaseNumber(
          caseAvailable,
          amountByDiff,
          amountByCat,
          amountByType,
          diffBool,
          catBool,
          typeBool,
        );

        if (questLeftToAdd <= 0) {
          flag = false;
          completed = true;
        } else if (caseNumber === -1) {
          flag = false;
        } else {
          switch (caseNumber) {
            case 0: {
              questionIdToSub.push(availableQuestions.d1c1t[availableQuestions.d1c1t.length - 1]);
              availableQuestions.d1c1t.pop();
              amountByDiff[0]++; amountByCat[0]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d1c1t.length === 0) {
                caseAvailable[0] = false;
                checkIfAvailable();
              }
              break;
            } case 1: {
              questionIdToSub.push(availableQuestions.d1c1x[availableQuestions.d1c1x.length - 1]);
              availableQuestions.d1c1x.pop();
              amountByDiff[0]++; amountByCat[0]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d1c1x.length === 0) {
                caseAvailable[1] = false;
                checkIfAvailable();
              }
              break;
            } case 2: {
              questionIdToSub.push(availableQuestions.d1c2t[availableQuestions.d1c2t.length - 1]);
              availableQuestions.d1c2t.pop();
              amountByDiff[0]++; amountByCat[1]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d1c2t.length === 0) {
                caseAvailable[2] = false;
                checkIfAvailable();
              }
              break;
            } case 3: {
              questionIdToSub.push(availableQuestions.d1c2x[availableQuestions.d1c2x.length - 1]);
              availableQuestions.d1c2x.pop();
              amountByDiff[0]++; amountByCat[1]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d1c2x.length === 0) {
                caseAvailable[3] = false;
                checkIfAvailable();
              }
              break;
            } case 4: {
              questionIdToSub.push(availableQuestions.d1c3t[availableQuestions.d1c3t.length - 1]);
              availableQuestions.d1c3t.pop();
              amountByDiff[0]++; amountByCat[2]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d1c3t.length === 0) {
                caseAvailable[4] = false;
                checkIfAvailable();
              }
              break;
            } case 5: {
              questionIdToSub.push(availableQuestions.d1c3x[availableQuestions.d1c3x.length - 1]);
              availableQuestions.d1c3x.pop();
              amountByDiff[0]++; amountByCat[2]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d1c3x.length === 0) {
                caseAvailable[5] = false;
                checkIfAvailable();
              }
              break;
            } case 6: {
              questionIdToSub.push(availableQuestions.d2c1t[availableQuestions.d2c1t.length - 1]);
              availableQuestions.d2c1t.pop();
              amountByDiff[1]++; amountByCat[0]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d2c1t.length === 0) {
                caseAvailable[6] = false;
                checkIfAvailable();
              }
              break;
            } case 7: {
              questionIdToSub.push(availableQuestions.d2c1x[availableQuestions.d2c1x.length - 1]);
              availableQuestions.d2c1x.pop();
              amountByDiff[1]++; amountByCat[0]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d2c1x.length === 0) {
                caseAvailable[7] = false;
                checkIfAvailable();
              }
              break;
            } case 8: {
              questionIdToSub.push(availableQuestions.d2c2t[availableQuestions.d2c2t.length - 1]);
              availableQuestions.d2c2t.pop();
              amountByDiff[1]++; amountByCat[1]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d2c2t.length === 0) {
                caseAvailable[8] = false;
                checkIfAvailable();
              }
              break;
            } case 9: {
              questionIdToSub.push(availableQuestions.d2c2x[availableQuestions.d2c2x.length - 1]);
              availableQuestions.d2c2x.pop();
              amountByDiff[1]++; amountByCat[1]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d2c2x.length === 0) {
                caseAvailable[9] = false;
                checkIfAvailable();
              }
              break;
            } case 10: {
              questionIdToSub.push(availableQuestions.d2c3t[availableQuestions.d2c3t.length - 1]);
              availableQuestions.d2c3t.pop();
              amountByDiff[1]++; amountByCat[2]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d2c3t.length === 0) {
                caseAvailable[10] = false;
                checkIfAvailable();
              }
              break;
            } case 11: {
              questionIdToSub.push(availableQuestions.d2c3x[availableQuestions.d2c3x.length - 1]);
              availableQuestions.d2c3x.pop();
              amountByDiff[1]++; amountByCat[2]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d2c3x.length === 0) {
                caseAvailable[11] = false;
                checkIfAvailable();
              }
              break;
            } case 12: {
              questionIdToSub.push(availableQuestions.d3c1t[availableQuestions.d3c1t.length - 1]);
              availableQuestions.d3c1t.pop();
              amountByDiff[2]++; amountByCat[0]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d3c1t.length === 0) {
                caseAvailable[12] = false;
                checkIfAvailable();
              }
              break;
            } case 13: {
              questionIdToSub.push(availableQuestions.d3c1x[availableQuestions.d3c1x.length - 1]);
              availableQuestions.d3c1x.pop();
              amountByDiff[2]++; amountByCat[0]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d3c1x.length === 0) {
                caseAvailable[13] = false;
                checkIfAvailable();
              }
              break;
            } case 14: {
              questionIdToSub.push(availableQuestions.d3c2t[availableQuestions.d3c2t.length - 1]);
              availableQuestions.d3c2t.pop();
              amountByDiff[2]++; amountByCat[1]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d3c2t.length === 0) {
                caseAvailable[14] = false;
                checkIfAvailable();
              }
              break;
            } case 15: {
              questionIdToSub.push(availableQuestions.d3c2x[availableQuestions.d3c2x.length - 1]);
              availableQuestions.d3c2x.pop();
              amountByDiff[2]++; amountByCat[1]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d3c2x.length === 0) {
                caseAvailable[15] = false;
                checkIfAvailable();
              }
              break;
            } case 16: {
              questionIdToSub.push(availableQuestions.d3c3t[availableQuestions.d3c3t.length - 1]);
              availableQuestions.d3c3t.pop();
              amountByDiff[2]++; amountByCat[2]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d3c3t.length === 0) {
                caseAvailable[16] = false;
                checkIfAvailable();
              }
              break;
            } case 17: {
              questionIdToSub.push(availableQuestions.d3c3x[availableQuestions.d3c3x.length - 1]);
              availableQuestions.d3c3x.pop();
              amountByDiff[2]++; amountByCat[2]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d3c3x.length === 0) {
                caseAvailable[17] = false;
                checkIfAvailable();
              }
              break;
            } case 18: {
              questionIdToSub.push(availableQuestions.d4c1t[availableQuestions.d4c1t.length - 1]);
              availableQuestions.d4c1t.pop();
              amountByDiff[3]++; amountByCat[0]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d4c1t.length === 0) {
                caseAvailable[18] = false;
                checkIfAvailable();
              }
              break;
            } case 19: {
              questionIdToSub.push(availableQuestions.d4c1x[availableQuestions.d4c1x.length - 1]);
              availableQuestions.d4c1x.pop();
              amountByDiff[3]++; amountByCat[0]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d4c1x.length === 0) {
                caseAvailable[19] = false;
                checkIfAvailable();
              }
              break;
            } case 20: {
              questionIdToSub.push(availableQuestions.d4c2t[availableQuestions.d4c2t.length - 1]);
              availableQuestions.d4c2t.pop();
              amountByDiff[3]++; amountByCat[1]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d4c2t.length === 0) {
                caseAvailable[20] = false;
                checkIfAvailable();
              }
              break;
            } case 21: {
              questionIdToSub.push(availableQuestions.d4c2x[availableQuestions.d4c2x.length - 1]);
              availableQuestions.d4c2x.pop();
              amountByDiff[3]++; amountByCat[1]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d4c2x.length === 0) {
                caseAvailable[21] = false;
                checkIfAvailable();
              }
              break;
            } case 22: {
              questionIdToSub.push(availableQuestions.d4c3t[availableQuestions.d4c3t.length - 1]);
              availableQuestions.d4c3t.pop();
              amountByDiff[3]++; amountByCat[2]++; amountByType[0] += trPart; questLeftToAdd--;
              if (availableQuestions.d4c3t.length === 0) {
                caseAvailable[22] = false;
                checkIfAvailable();
              }
              break;
            } case 23: {
              questionIdToSub.push(availableQuestions.d4c3x[availableQuestions.d4c3x.length - 1]);
              availableQuestions.d4c3x.pop();
              amountByDiff[3]++; amountByCat[2]++; amountByType[1] += 1 - trPart; questLeftToAdd--;
              if (availableQuestions.d4c3x.length === 0) {
                caseAvailable[23] = false;
                checkIfAvailable();
              }
              break;
            } default: {
              flag = false;
              break;
            }
          }
        }
      }
      if (completed) {
        questionIdToSub.push(questionsInTheEnd);
        return questionIdToSub;
      }
      return false;
    });
};

apiModule.makeTestSubmission = function (testAssignmentId, studentId) {
  let assignmentToSubmit;
  return TestAssignment
    .findById(testAssignmentId)
    .then((assignment) => {
      assignmentToSubmit = assignment;
    })
    .then(() => apiModule.getQuestionsToSubmit(
      assignmentToSubmit.tags,
      assignmentToSubmit.type,
      assignmentToSubmit.testSize,
      assignmentToSubmit.trainingPercentage,
    ))
    .then((questionsInSub) => {
      if (questionsInSub) {
        return TestSubmission.create({
          userId: studentId,
          teacherId: assignmentToSubmit.teacherId,
          creationDate: new Date().getTime(),
          timeToPass: assignmentToSubmit.timeToPass,
          status: SUBMISSION_STATUS_PENDING,
          assignmentId: assignmentToSubmit._id,
          questionsId: questionsInSub,
        });
      }
      throw new Error('Not enough questions');
    })
    .then((submission) => {
      if (submission !== null && assignmentToSubmit.studentId !== undefined) {
        return TestAssignment
          .findByIdAndUpdate(testAssignmentId, { $set: { status: ASSIGNMENT_STATUS_PASSED } })
          .then(() => TestSubmission
            .findById(submission._id)
            .populate('questionsId', '_id category difficulty question type answerOptions tags')
            .lean());
      } else if (submission !== null && assignmentToSubmit.groupId !== undefined) {
        return TestSubmission
          .findById(submission._id)
          .populate('questionsId', '_id category difficulty question type answerOptions tags')
          .lean();
      } else if (submission === null) {
        throw new Error('Empty submition');
      } else if (submission === undefined) {
        throw new Error('Can not create test submission');
      }
    });
};

const updateQuestion = function (questId, res) {
  return Question
    .findById(questId)
    .select('peopleTested peopleAnswered')
    .then((questionInfo) => {
      const info = [questionInfo.peopleTested + 1, questionInfo.peopleAnswered];
      if (res) info[1]++;
      return info;
    })
    .then(info => Question
      .findByIdAndUpdate(questId, {
        $set: {
          peopleTested: info[0],
          peopleAnswered: info[1],
        },
      }))
    .then(() => true);
};

const isCheckingPossible = function (subId) {
  let condition1;
  return CheckRequest
    .countDocuments({ status: REQUEST_STATUS_PENDING, submissionId: subId })
    .then((amount) => {
      condition1 = !amount;
      return TestSubmission
        .findById(subId)
        .select('status');
    })
    .then((sub) => {
      if (sub.status === SUBMISSION_STATUS_ANSWERED) {
        return true;
      } return false;
    })
    .then(condition2 => condition1 && condition2);
};

const checkSub = function (subId) {
  let submiss = {};
  return TestSubmission
    .findByIdAndUpdate(subId, { $set: { status: SUBMISSION_STATUS_CHECKED } })
    .populate('questionsId', 'correctOptions category')
    .then((submission) => {
      submiss = submission;
    })
    .then(() => {
      const checkIfRight = function (ans, quest) {
        if (
          quest._id == ans.questionId && quest.category === CATEGORY_WORD_ANSWER &&
          ans.answ === quest.correctOptions) {
          return true;
        } else if (
          quest._id == ans.questionId && quest.category !== CATEGORY_SENTENCE_ANSWER &&
          quest.category !== CATEGORY_WORD_ANSWER &&
          (ans.answ.every((el, index) => {
            if (el === quest.correctOptions[index]) return true;
            return false;
          }))) { return true; }

        return false;
      };
      submiss.answers.forEach((ans, index) => {
        if (submiss.questionsId.some(quest => checkIfRight(ans, quest))) {
          submiss.answers[index].result = true;

          updateQuestion(submiss.answers[index].questionId, true);
        } else if (submiss.answers[index].category !== CATEGORY_SENTENCE_ANSWER) {
          submiss.answers[index].result = false;

          updateQuestion(submiss.answers[index].questionId, false);
        }
      });

      return submiss;
    })
    .then(() => {
      apiModule.getCheckingResultsAndUpdateSub(subId, submiss.answers);
    });
};

apiModule.initCheckingSequence = function (subId) {
  return isCheckingPossible(subId)
    .then((doCheck) => {
      if (doCheck) {
        checkSub(subId);
      } else return false;
    });
};

apiModule.getAnswersAndUpdateSubmition = function (submissionId, allAnswers) {
  return TestSubmission
    .findByIdAndUpdate(
      submissionId,
      {
        $set: {
          answers: allAnswers,
          status: SUBMISSION_STATUS_ANSWERED,
          completeDate: new Date().getTime(),
        },
      },
    )
    .populate('assignmentId', 'teacherId _id')
    .then(submission => Promise.all(allAnswers.map((el) => {
      if (el.checking === 'true') {
        return CheckRequest.create({
          studentId: submission.userId,
          teacherId: submission.assignmentId.teacherId,
          assignmentId: submission.assignmentId._id,
          submissionId: submission._id,
          questionId: el.questionId,
          answer: el.answ,
        });
      }
      return true;
    })))
    .then(() => { apiModule.initCheckingSequence(submissionId); });
};

apiModule.getCheckingResultsAndUpdateSub = function (submissionId, allAnswers) {
  return TestSubmission
    .findByIdAndUpdate(
      submissionId,
      {
        $set: {
          answers: allAnswers,
          status: SUBMISSION_STATUS_CHECKED,
        },
      },
    )
    .then(() => true);
};

apiModule.getQuestionsToCheck = function (teachId, skip = 0, top = 10) {
  const res = {};
  return CheckRequest
    .countDocuments({ teacherId: teachId, status: REQUEST_STATUS_PENDING })
    .then((amount) => {
      res.amount = amount;
      return CheckRequest
        .find({ teacherId: teachId, status: REQUEST_STATUS_PENDING })
        .populate('questionId', 'section tags question')
        .populate('submissionId', 'completeDate ')
        .populate('studentId', 'name surname')
        .skip(+skip < 0 ? 0 : +skip)
        .limit(+top <= 0 ? 10 : +top)
        .lean();
    })
    .then((requests) => {
      res.requests = requests;
      return res;
    });
};

apiModule.sendCheckingResults = function (checkingId, res) {
  let question;
  let subId;
  return CheckRequest
    .findByIdAndUpdate(checkingId, {
      $set: {
        status: REQUEST_STATUS_CHECKED,
        result: res,
        checkDate: new Date().getTime(),
      },
    })
    .then((check) => {
      question = check.questionId;
      subId = check.submissionId;
      return TestSubmission
        .findById(check.submissionId)
        .select('answers _id');
    })
    .then(submission => Promise.all(submission.answers.map((el) => {
      if (el.checking && el.questionId == question) {
        const elReassign = {};
        elReassign.checking = 'false';
        elReassign.questionId = el.questionId;
        elReassign.answ = el.answ;
        elReassign.result = res;
        return elReassign;
      }
      return el;
    })))
    .then(answ => TestSubmission
      .findByIdAndUpdate(subId, { $set: { answers: answ } }))
    .then(submission => apiModule.initCheckingSequence(submission._id))
    .then(() => updateQuestion(question, res))
    .then(() => true);
};

apiModule.getSubmissionsByAssignment = function (assignId) {
  return TestSubmission
    .find({ assignmentId: assignId })
    .populate('questionsId', '_id assignmentId status category difficulty question type answerOptions tags mark')
    .populate('userId', 'name surname')
    .lean();
};

apiModule.getSubmissionsByAssignmentAndStd = function (assignId, studId) {
  return TestSubmission
    .find({ assignmentId: assignId, userId: studId })
    .populate('questionsId', '_id assignmentId status category difficulty question type answerOptions tags mark')
    .populate('userId', 'name surname')
    .lean();
};

apiModule.getSubmissionsByStudent = function (studId, skip = 0, top = 10) {
  const allSubmissions = {};
  allSubmissions.subAmount = 0;
  allSubmissions.submissions = [];
  return TestSubmission
    .countDocuments({ studentId: studId })
    .then((amount) => {
      allSubmissions.subAmount = amount;
      return TestSubmission
        .find({ studentId: studId })
        .skip(+skip < 0 ? 0 : +skip)
        .limit(+top <= 0 ? 10 : +top)
        .populate('questionsId', '_id category difficulty question type answerOptions tags')
        .lean();
    })
    .then((submissions) => {
      allSubmissions.submissions = submissions;
      return allSubmissions;
    });
};

apiModule.getTestsByStudent = function (studId, skip = 0, top = 10) {
  const allSubmissions = {};
  allSubmissions.subAmount = 0;
  allSubmissions.submissions = [];
  return TestSubmission
    .countDocuments({ studentId: studId })
    .then((amount) => {
      allSubmissions.subAmount = amount;
      return TestSubmission
        .find({ studentId: studId })
        .skip(+skip < 0 ? 0 : +skip)
        .limit(+top <= 0 ? 10 : +top)
        .populate('questionsId', '_id category difficulty question type answerOptions tags')
        .lean();
    })
    .then((submissions) => {
      allSubmissions.submissions = submissions;
      return allSubmissions;
    });
};

module.exports = apiModule;
