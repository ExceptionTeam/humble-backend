const { setTimeout } = require('timers');
const Docker = require('dockerode');
const path = require('path');
const fs = require('fs');

const storageController = require('../../server/controllers/storage-controller');

const docker = new Docker();

function runExec(container, cmd) {
  const options = {
    Cmd: cmd,
    AttachStdOut: true,
    AttachStdErr: true,
  };
  return container.exec(options)
    .then(exec => exec.start({ Detach: false }))
    .then(exec => new Promise((resolve, reject) => {
      exec.output.on('close', resolve);
      exec.output.on('end', resolve);
      exec.output.on('error', reject);
      exec.output.pipe(process.stdout);
    }));
}

module.exports = function (containerInfoPromise, next) {
  const compilationModule = {};

  let containerCondition = [];

  containerInfoPromise
    .then((containerInfo) => {
      containerInfo.forEach((el, i) => {
        containerCondition[i] = {
          id: el.id,
          index: i,
          volumePath: el.volumePath,
          submission: null,
        };
      });
    });

  const loadBasicData = function (containerIndex) {
    return storageController
      .getTestsTask(
        containerCondition[containerIndex].volumePath,
        containerCondition[containerIndex].submission,
      );
  };

  compilationModule.enter = function (submission) {
    const containerIndex = containerCondition.findIndex(el => !el.submission);
    containerCondition[containerIndex].submission = submission;
    loadBasicData(containerIndex)
      .then(() => setTimeout(compile, 0, containerIndex));
  };

  const compile = function (containerIndex) {
    const myPath = containerCondition[containerIndex].volumePath;
    const container = docker.getContainer(containerCondition[containerIndex].id);
    const testsAmount = containerCondition[containerIndex].submission.tests.length;
    Promise.resolve()
      .then(() => container.start())
      .then(() => runExec(container, ['javac', 'Main.java']))
      .then(() => {
        let testsLine = Promise.resolve();
        for (let i = 0; i < testsAmount; i++) {
          testsLine = testsLine
            .then(() => runExec(container, ['mv', `input${i + 1}.txt`, 'input.txt']))
            .then(() => runExec(container, ['java', 'Main']))
            .then(() => {
              const a1 = fs.readFileSync(path.join(myPath, 'output.txt')).toString();
              const a2 = fs.readFileSync(path.join(myPath, 'output' + (i + 1) + '.txt')).toString();
              containerCondition[containerIndex].submission.tests[i] = a1 === a2;
            })
            .catch((err) => {
              console.log(err);
              containerCondition[containerIndex].submission.tests[i] = false;
            })
            .then(() => runExec(container, ['rm', 'input.txt']))
            .then(() => runExec(container, ['rm', 'output.txt']));
        }
        return testsLine;
      })
      .then(() => container.stop())
      .then(() => setTimeout(compilationModule.leave, 0, containerIndex));
  };

  const unloadBasicData = function (containerIndex) {
    const myPath = containerCondition[containerIndex].volumePath;
    fs.unlinkSync(path.join(myPath, 'Main.java'));
    fs.unlinkSync(path.join(myPath, 'Main.class'));
    console.log(containerCondition[containerIndex]);
    containerCondition[containerIndex].submission.tests.forEach((el, i) => {
      fs.unlinkSync(path.join(myPath, 'output' + (i + 1) + '.txt'));
    });
  };

  compilationModule.leave = function (containerIndex) {
    const { submission } = containerCondition[containerIndex];
    unloadBasicData(containerIndex);
    containerCondition[containerIndex].submission = null;
    setTimeout(next, 0, submission);
  };

  return compilationModule;
};
