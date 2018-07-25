const fs = require('fs');

module.exports = function (CONTAINERS_AMOUNT, next) {
  const compilationModule = {};
  const containerCondition = new Array(CONTAINERS_AMOUNT).fill({
    submission: null,
  });
  containerCondition.forEach((el, i) => {
    containerCondition[i].volumePath = '../containers/volume-' + i + '/';
    containerCondition[i].containerIndex = i;
  });

  const loadBasicData = function (submission, containerIndex) {
    // write test input/output files in path
  };

  const prepareIterationData = function (iteration, containerIndex) {
    const path = containerCondition[containerIndex].volumePath;
    fs.renameSync(path + 'input' + iteration + '.txt', path + 'input.txt');
  };

  compilationModule.enter = function (submission) {
    const containerIndex = containerCondition.findIndex(el => !el.submission);
    containerCondition[containerIndex].submission = submission;
    loadBasicData(submission, containerIndex);
    compile();
  };

  const compile = function () {
    // plz compile here
    compilationModule.leave();
  };

  const unprepareIterationData = function (iteration, containerIndex) {
    const path = containerCondition[containerIndex].volumePath;
    fs.renameSync(path + 'input.txt', path + 'input' + iteration + '.txt');
  };

  const unloadBasicData = function (containerIndex) {
    const path = containerCondition[containerIndex].volumePath;
    fs.unlinkSync(path + 'src.java');
    containerCondition[containerIndex].submission.tests.forEach((el, i) => {
      fs.unlinkSync(path + 'input' + i + '.txt');
      fs.unlinkSync(path + 'output' + i + '.txt');
    });
  };

  compilationModule.leave = function (containerIndex) {
    const { submission } = containerCondition[containerIndex];
    containerCondition[containerIndex].submission = null;
    unloadBasicData();
    next(submission);
  };

  return compilationModule;
};

