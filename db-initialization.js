const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/mongoose_basics';

const options = {
  useNewUrlParser: true,
};

mongoose.connect(uri, options);
module.exports = mongoose;
