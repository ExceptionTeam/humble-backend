const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/mongoose_basics';

const options = {
  useNewUrlParser: true,
};

mongoose.connect(uri, options);

require('./server/models/user/user');
require('./server/models/user/group');
require('./server/models/user/user-assignment');

require('./server/models/testing/question');
require('./server/models/testing/section');
require('./server/models/testing/section-relation');
require('./server/models/testing/tag-attachment');
require('./server/models/testing/test-assignment');
require('./server/models/testing/test-submission');
require('./server/models/testing/test-request');

require('./server/models/tasks/file');
require('./server/models/tasks/task-assignment');
require('./server/models/tasks/task-submission');
require('./server/models/tasks/task');

module.exports = mongoose;
