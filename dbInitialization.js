'use strict'

const mongoose = require('mongoose');

const uri = 'mongodb://localhost/mongoose_basics';

const options = {
  useNewUrlParser: true,
};

mongoose.connect(uri, options);
