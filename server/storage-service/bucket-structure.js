const bucketStructure = {};

bucketStructure.generateNameInput = function (number) {
  return `input${number}`;
};

bucketStructure.generateNameOutput = function (number) {
  return `output${number}`;
};

bucketStructure.generatePathInputs = function (taskId, number) {
  return `Task_${taskId}/Inputs/input${number}.txt`;
};

bucketStructure.generatePathOutputs = function (taskId, number) {
  return `Task_${taskId}/Outputs/output${number}.txt`;
};

module.exports = bucketStructure;
