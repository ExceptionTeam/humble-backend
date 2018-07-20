const express = require('express');
const bodyParser = require('body-parser');

require('./db-initialization');
require('./docker-initialization');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = require('./server/routes/index');

app.use(router);

const server = app.listen(port, () => {
  console.log(`Server on port ${server.address().port}`);
});
