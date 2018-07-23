const Docker = require('dockerode');

const CONTAINERS_AMOUNT = 5;
require('./docker/api/index')(CONTAINERS_AMOUNT);

// const docker = new Docker();

