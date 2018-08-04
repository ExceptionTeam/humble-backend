const fs = require('fs');
const path = require('path');
const Docker = require('dockerode');

const { CONTAINERS_AMOUNT, CONTAINER_VOLUME_NAME, CONTAINERS_VOLUMES_PATH } = require('../../config');

const docker = new Docker();

const containerInfo = new Array(CONTAINERS_AMOUNT).fill({
  id: null,
  volumePath: null,
});

const basicPath = path.resolve(CONTAINERS_VOLUMES_PATH + '/containers');

(function initContainersFolder() {
  fs.mkdir(basicPath, (err) => {
    if (!err) {
      containerInfo.forEach((el, i) => {
        containerInfo[i].volumePath = basicPath + '/' + CONTAINER_VOLUME_NAME + '-' + i;
        fs.mkdir(el.volumePath, () => {});
      });
    }
  });
}());

module.exports = Promise.all(containerInfo.map((el, i) => docker.createContainer({
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
  })));
