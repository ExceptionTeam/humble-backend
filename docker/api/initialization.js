const fs = require('fs');
const path = require('path');
const Docker = require('dockerode');

const { CONTAINERS_AMOUNT, CONTAINER_VOLUME_NAME, CONTAINERS_VOLUMES_PATH } = require('../../config');

const docker = new Docker();

const containerInfo = new Array(CONTAINERS_AMOUNT).fill({
  id: null,
  volumePath: null,
});

const basicPath = path.resolve(CONTAINERS_VOLUMES_PATH + '\\containers');


module.exports = Promise
  .resolve()
  .then(()=>{
    return new Promise((resolve, reject)=>{
    fs.mkdir(basicPath, (err) => {
      if (!err || err.code === 'EEXIST') {
        Promise.all(containerInfo.map((el, i) => {
          containerInfo[i].volumePath = basicPath + '\\' + CONTAINER_VOLUME_NAME + '-' + (i+1);
          return new Promise((res,rej)=> {fs.mkdir(el.volumePath, ()=>res())});
        }))
        .then(()=>resolve());
      }
  })})})
.then(()=>Promise.all(containerInfo.map((el, i) => docker.createContainer({
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
