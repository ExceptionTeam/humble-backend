const Express = require('express');
const Docker = require('dockerode');

const app = Express();
const docker = new Docker();
const path = require('path');
const fs = require('fs');

let id;
const tests = [];

function runExec(container, cmd) {
  const options = {
    Cmd: cmd,
    // AttachStdIn: true,
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


docker.createContainer({
  HostConfig: {
    Binds: [path.resolve('./haHAA') + ':/data'],
  },
  OpenStdin: true,
  Tty: false,
  WorkingDir: '/data',
  Cmd: ['/bin/sh'],
  name: 'test',
  Image: 'openjdk:alpine',
})
  .then((container) => {
    console.log('Container created');
    id = container.id;
    return container.start();
  })
  .then(container => runExec(container, ['javac', 'Main.java']))
  .then(() => {
    console.log('compiled');
    let testsLine = Promise.resolve();
    for (let i = 0; i < 5; i++) {
      testsLine = testsLine.then(() => console.log('started ' + i))
        .then(() => runExec(docker.getContainer(id), ['mv', `input${i + 1}.txt`, 'input.txt']))
        .then(() => {
          // fs.renameSync('./haHAA/input' + (i + 1) + '.txt', './haHAA/input.txt');
          console.log('=>');
          console.log(fs.readdirSync('./haHAA'));
          return runExec(docker.getContainer(id), ['java', 'Main']);
        })
        .then(() => {
          console.log('____1___' + i);
          const a1 = fs.readFileSync('./haHAA/output.txt').toString();
          const a2 = fs.readFileSync('./haHAA/output' + (i + 1) + '.txt').toString();
          tests[i] = a1 === a2;
          console.log(i + ' => ' + a1);
          console.log(i + ' => ' + a2);
        })
        .catch((err) => {
          console.log('____E___' + i);
          console.log(err);
          tests[i] = err;
        })
        .then(() => runExec(docker.getContainer(id), ['mv', 'input.txt', `input${i + 1}.txt`]))
        .then(() => runExec(docker.getContainer(id), ['rm', 'output.txt']));
    }
    return testsLine;
  })
  .then(() => {
    console.log('_____YEPP_____');
    console.log(tests);
  })
  .then(() => docker.getContainer(id).stop())
  .catch((err) => {
    console.log('_____NOPE_____');
    console.log(err);
  });
// .then(() => docker.getContainer(id).remove());

const port = 3000;

app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
