const route = require('express').Router();
const generalApi = require('../../db-middleware/general-api');

const taskRoute = require('./task');
const testRoute = require('./test');


// route.use((req, res, next) => (
//  (generalApi.isTeacher(req.user) || generalApi.isAdmin(req.user))
//    ? next() : res.status(403).end()));

route.use('/task', taskRoute);
route.use('/test', testRoute);


route.get('/students', (req, res) => {
  generalApi
    .getStudentsByTeacher(req.query.teacherId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

route.get('/group/members/:groupId', (req, res) => {
  generalApi.getStudentsByGroup(req.params.groupId, '-role -email -primarySkill -salt -hash -__v')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.post('/add/individual/student', (req, res) => {
  generalApi.addIndividualStudent(req.body.student, req.body.teacher)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.post('/delete/individual/student', (req, res) => {
  generalApi.deleteIndividualStudent(req.body.student, req.body.teacher)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.post('/add-group', (req, res) => {
  generalApi.addGroupToTeacher(req.body.name, req.body.teacherId)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.use(require('../student/'));

module.exports = route;
