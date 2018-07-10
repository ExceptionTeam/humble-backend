'use strict'

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const models = require('./server/models/Models');

const app = express();
const port = process.env.PORT || 3030;
const uri = 'mongodb://localhost/mongoose_basics';

app.use(express.static(`${__dirname}`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  useNewUrlParser: true
};

mongoose.connect(uri, options).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. **/ },
  err => { /** handle initial connection error **/ }
);

app.get('/', (req, res) => {
    res.send('Hello from Artёm!');
});

app.post('/requestTest', (req, res) => {
  const data = req.body;

  let requestTest = new models.Request({ /** create request for teachers **/
    _id: new mongoose.Types.ObjectId(),
    userId: data._id.toString(),
    section: data.section,
    status: "PENDING"
  });

  /** Save request into DB **/
  /** Send for all teachers requests for approvemt **/

  res.statusCode = 200;
  res.send();
});

const server = app.listen(port, () => {
  console.log(`Server on port ${server.address().port}`);
});
