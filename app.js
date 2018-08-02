const express = require('express');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const cookieParser = require('cookie-parser');
const passport = require('passport');

require('./server/initialization/db');

const app = express();
const port = 3000;

require('./server/initialization/passport');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboyBodyParser());
app.use(cookieParser());
app.use(expressSession({
  store: new MongoStore({
    url: 'mongodb://localhost/passport',
  }),
  secret: 'SECRET',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
  next();
});

const router = require('./server/routes/index');

app.use(router);

const server = app.listen(port, () => {
  console.log(`Server on port ${server.address().port}`);
});
