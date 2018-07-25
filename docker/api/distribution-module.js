
module.exports = function (next, CONTAINERS_AMOUNT, emmiter) {
  const distributionModule = {};

  const submissionQueue = (function () {
    const queue = [];
    return {
      length: 0,
      enqueueSubmission(submission) {
        queue.push(submission);
        this.length++;
        emmiter.emit('submission-new');
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

  const tryEnterCompilationModule = function () {
    const submission = submissionQueue.dequeueSubmission();
    if (submission) {
      setTimeout(() => next(submission), 0);
      return true;
    }
    return false;
  };

  distributionModule.semaphore = (function () {
    let count = CONTAINERS_AMOUNT;
    return {
      wait() {
        if (count) {
          --count;
          tryEnterCompilationModule();
        }
      },
      signal() {
        if (!tryEnterCompilationModule()) {
          ++count;
        }
      },
    };
  }());

  distributionModule.submissionQueue = submissionQueue;

  return distributionModule;
};
