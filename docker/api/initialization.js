const fs = require('fs');
const path = require('path');
const Docker = require('dockerode');

const {CONTAINERS_AMOUNT, CONTAINER_VOLUME_NAME, CONTAINERS_VOLUMES_PATH} = require('../../config');

const docker = new Docker();

const containerInfo = new Array(CONTAINERS_AMOUNT).fill({
    id: null,
    volumePath: null,
});

const basicPath = path.join(path.resolve(CONTAINERS_VOLUMES_PATH, 'containers'));


module.exports = Promise
    .resolve()
    .then(() => new Promise((resolve1, reject1) => {
        fs.mkdir(basicPath, (err) => {
            if (!err || err.code === 'EEXIST') {
                Promise.all(containerInfo.map((el, i) => {
                    return new Promise((resolve2, reject2) => {
                        el.volumePath = path.join(basicPath, CONTAINER_VOLUME_NAME + '-' + (i + 1));
                        resolve2();
                        })
                        .then((arr) => {
                            fs.mkdir(el.volumePath, () => {});
                        });
                        }));
                    /*Promise.all(containerInfo.map((el, i) => {
                      containerInfo[i].volumePath = path.join(basicPath, CONTAINER_VOLUME_NAME + '-' + (i + 1));
                      return new Promise((res, rej) => { fs.mkdir(el.volumePath, () => res()); });
                    }))
                      .then(() => resolve());*/
                }});
        resolve1();
    }))
    .then(() => console.log(containerInfo))
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
            console.log(containerInfo);
            containerInfo[i].id = container.id;
            return containerInfo[i];
        })
        .catch((err) => {
            console.log(err);
        }))));
