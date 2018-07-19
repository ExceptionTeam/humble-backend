const route = require('express').Router();

const studentRoute = require('./student/index');
const teacherRoute = require('./teacher/index');
const adminRoute = require('./admin/index');

route.use('/student', studentRoute);
route.use('/teacher', teacherRoute);
route.use('/admin', adminRoute);

module.exports = route;
