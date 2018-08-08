const { TaskSubmission } = require('../../server/models/tasks/task-submission');

module.exports = function (emmiter) {
  const saveModule = {};

  const markCalculationAlgorithm = function (tests) {
    const correct = tests.reduce((container, el) => (container + (el === true ? 1 : 0)));
    console.log(tests.length + ' ' + correct);
    return (10 * correct) / tests.length;
  };

  saveModule.save = function (submission) {
    emmiter.emit('submission-save');
    console.log('save!');
    TaskSubmission.create({
      _id: submission._id,
      assignId: submission.assignId,
      srcFileId: submission.srcFileId,
      mark: submission.tests.length ? markCalculationAlgorithm(submission.tests) : 0,
      submitTime: submission.submitTime,
      tests: submission.tests,
    });
  };

  return saveModule;
};
