const route = require('express').Router();

const taskRoute = require('./task');
const testRoute = require('./test');


route.use('/task', taskRoute);
route.use('/test', testRoute);

module.exports = route;
