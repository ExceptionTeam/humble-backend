const express = require('express');
const bodyParser = require('body-parser');

require('./db-initialization');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET DELETE, OPTIONS');
  next();
});

const router = require('./server/routes/index');

app.use(router);

const server = app.listen(port, () => {
  console.log(`Server on port ${server.address().port}`);
});
