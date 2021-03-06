const route = require('express').Router();
const passport = require('passport');
const generalApi = require('../db-middleware/general-api');
const testApi = require('../db-middleware/test-api');
const taskApi = require('../db-middleware/task-api');

// route.use((req, res, next) => {
//   if (req.isUnauthenticated()) {
//     next();
//   } else {
//     res.status(403).send();
//   }
// });

route.use('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (user) {
      req.login(user, error => (error ?
        res.status(400).end() :
        res.json({
          id: user._id,
          name: user.name,
          surname: user.surname,
          role: user.role,
          email: user.email,
        })));
    } else {
      return res.status(400).json(err);
    }
  })(req, res, next);
});

route.post('/register', (req, res) => {
  (req.body.isStudent ? generalApi.addNewStudent : generalApi.addNewTeacher)({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    primarySkill: req.body.primarySkill,
    account: req.body.account,
  })
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

route.post('/reset-password', (req, res) => {
  generalApi
    .resetPassword(req.body.email)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

route.get('/test-statistics', (req, res) => {
  testApi
    .getStatistics(10)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(500).send();
    });
});

route.get('/task-statistics', (req, res) => {
  taskApi
    .getStatistics(10)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

route.post('/university', (req, res) => {
  generalApi.getUniversity(req.body.filterConfig || '')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.post('/primary-skills', (req, res) => {
  generalApi.getSkills(req.body.filterConfig || '')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.get('/activity-statistics', (req, res) => {
  testApi
    .getStatisticsActivity(10)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.get('/rating-statistics', (req, res) => {
  testApi
    .getStatisticsRating(10)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = route;
