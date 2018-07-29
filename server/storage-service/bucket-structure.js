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
  return `Task_${taskId}/Submissions/Submissions_${submissionId}/submis${fileId}.txt`;
};

module.exports = bucketStructure;
