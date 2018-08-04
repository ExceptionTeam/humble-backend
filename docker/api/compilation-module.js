const { setTimeout } = require('timers');

const Docker = require('dockerode');
const fs = require('fs');

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

  let containerCondition;

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
    // write test input/output files in path
  };

  compilationModule.enter = function (submission) {
    const containerIndex = containerCondition.findIndex(el => !el.submission);
    containerCondition[containerIndex].submission = submission;
    loadBasicData(containerIndex)
      .then(() => setTimeout(compile, 0, containerIndex));
  };

  const compile = function (containerIndex) {
    const path = containerCondition[containerIndex].volumePath;
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
              const a1 = fs.readFileSync(path + '/output.txt').toString();
              const a2 = fs.readFileSync(path + '/output' + (i + 1) + '.txt').toString();
              containerCondition[containerIndex].submission.tests[i] = a1 === a2;
            })
            .catch((err) => {
              console.log(err);
              containerCondition[containerIndex].submission.tests[i] = err;
            })
            .then(() => runExec(container, ['mv', 'input.txt', `input${i + 1}.txt`]))
            .then(() => runExec(container, ['rm', 'output.txt']));
        }
        return testsLine;
      })
      .then(() => container.stop())
      .then(() => setTimeout(compilationModule.leave, 0, containerIndex));
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
    setTimeout(() => next(submission), 0);
  };

  return compilationModule;
};

