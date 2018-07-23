const fs = require('fs');

const compilationModule = {};

compilationModule.prepareData = function (index, submission) {
  const path = '../containers/volume-' + index;
  fs.writeFileSync(path, submission.srcFile);
  // write test input/output files in path
};

