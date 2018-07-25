const { TaskSubmission } = require('../../server/models/tasks/task-submission');

module.exports = function () {
  const saveModule = {};

  const markCalculationAlgorithm = function (tests) {
    const correct = tests.reduce((container, el) => (container + el ? 1 : 0));
    return (100 * correct) / tests.length;
  };

  saveModule.save = function (submission) {
    const result = new TaskSubmission({
      assignId: submission.assignId,
      srcFileId: submission.srcFileId,
      mark: markCalculationAlgorithm(submission.tests),
      submitTime: submission.submitTime,
      tests: submission.tests,
    });
    result.save();
    saveModule.leave();
  };

  return saveModule;
};
