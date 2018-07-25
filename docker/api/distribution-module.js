
module.exports = function (next) {
  const distributionModule = {};

  const submissionQueue = (function () {
    const queue = [];
    return {
      length: 0,
      enqueueSubmission(submission) {
        queue.push(submission);
        this.length++;
      },
      dequeueSubmission() {
        if (queue.length) {
          this.length--;
          return queue.shift();
        }
        return null;
      },
    };
  }());

  distributionModule.submissionQueue = submissionQueue;

  distributionModule.tryEnterCompilationModule = function () {
    const submission = submissionQueue.dequeueSubmission();
    if (submission) {
      next(submission);
    }
    return null;
  };

  return distributionModule;
};