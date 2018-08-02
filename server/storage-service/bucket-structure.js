const bucketStructure = {};

bucketStructure.generateNameInput = function (number) {
  return `input${number}`;
};

bucketStructure.generateNameOutput = function (number) {
  return `output${number}`;
};

bucketStructure.generateNameSubmission = function (submissionId) {
  return `submis${submissionId}`;
};

bucketStructure.generatePathInputs = function (taskId, number) {
  return `Task_${taskId}/Inputs/input${number}.txt`;
};

bucketStructure.generatePathOutputs = function (taskId, number) {
  return `Task_${taskId}/Outputs/output${number}.txt`;
};

bucketStructure.generatePathSubmission = function (taskId, submissionId, fileId) {
  return `Task_${taskId}/Submissions/Submissions_${submissionId}/submis${fileId}.java`;
};

bucketStructure.generatePathTests = function (test, taskId) {
  if (test.startsWith('input')) {
    return `Task_${taskId}/Inputs/${test}.txt`;
  }
  return `Task_${taskId}/Outputs/${test}.txt`;
};

bucketStructure.generateArrayNames = function (taskId, number) {
  const inputs = new Array(number).fill(0).map((el, i) =>
    ({ Key: this.generatePathInputs(taskId, i + 1) }));
  const outputs = new Array(number).fill(0).map((el, i) =>
    ({ Key: this.generatePathOutputs(taskId, i + 1) }));
  return inputs.concat(outputs);
};

module.exports = bucketStructure;
