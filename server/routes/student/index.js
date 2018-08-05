const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');

const taskRoute = require('./task');
const testRoute = require('./test');

// route.use((req, res, next) => (generalApi.isStudent(req.user) ? next() : res.status(403).end()));

route.use('/task', taskRoute);
route.use('/test', testRoute);

module.exports = route;
