const express = require('express');
mongoose = require('mongoose');
bodyParser = require('body-parser');
const controllers = require('./server/controllers/StudInfoController');

const app = express();
app.use(express.static(`${__dirname}`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
port = process.env.PORT || 3030;

app.get('/', (request, response) => {
    controllers.addStudInfo([]);
    response.send('Hello from Artёm!');
});

const server = app.listen(port, () => {
  console.log(`Server on port ${server.address().port}`);
});
