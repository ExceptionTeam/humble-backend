const fs = require('fs');
const path = require('path');
const Docker = require('dockerode');

const { CONTAINERS_AMOUNT, CONTAINER_VOLUME_NAME, CONTAINERS_VOLUMES_PATH } = require('../../config');

const docker = new Docker();

const containerInfo = [];

const basicPath = path.join(path.resolve(CONTAINERS_VOLUMES_PATH, 'containers'));


module.exports = Promise
  .resolve()
  .then(() => new Promise((resolve, reject) => {
    fs.mkdir(basicPath, (err) => {
      if (!err || err.code === 'EEXIST') {
        for (let i = 0; i < CONTAINERS_AMOUNT; i++) {
          containerInfo[i] = {
            volumePath: path.join(basicPath, CONTAINER_VOLUME_NAME + '-' + (i + 1)),
          };
          try {
            fs.mkdirSync(containerInfo[i].volumePath);
          } catch (error) {
            if (error.code !== 'EEXIST') {
              console.log(err);
            }
          }
        }
      }
      resolve();
    });
  }))
  .then(() => Promise.all(containerInfo.map((el, i) => docker.createContainer({
    HostConfig: {
      Binds: [containerInfo[i].volumePath + ':/data'],
    },
    OpenStdin: true,
    Tty: false,
    WorkingDir: '/data',
    Cmd: ['/bin/sh'],
    name: 'tester-' + i,
    Image: 'openjdk:alpine',
  })
    .then((container) => {
      containerInfo[i].id = container.id;
      return containerInfo[i];
    })
    .catch((err) => {
      console.log(err);
    }))));
