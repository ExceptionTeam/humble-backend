const { TaskSubmission } = require('../../server/models/tasks/task-submission');

module.exports = function (emmiter) {
  const saveModule = {};

  const markCalculationAlgorithm = function (tests) {
    const correct = tests.reduce((container, el) => (container + el ? 1 : 0));
    return (100 * correct) / tests.length;
  };

  saveModule.save = function (submission) {
    emmiter.emit('submission-save');
    TaskSubmission.create({
      assignId: submission.assignId,
      srcFileId: submission.srcFileId,
      mark: markCalculationAlgorithm(submission.tests),
      submitTime: submission.submitTime,
      tests: submission.tests,
    });
  };

  return saveModule;
};
