'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./dbInitialization');

const app = express();
const port = process.env.PORT || 3030;

app.use(express.static(`${__dirname}`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from Artёm!');
});

const server = app.listen(port, () => {
  console.log(`Server on port ${server.address().port}`);
});
