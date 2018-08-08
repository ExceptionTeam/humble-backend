const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/mongoose_basics';

const options = {
  useNewUrlParser: true,
};

mongoose.connect(uri, options);

require('../models/user/user');
require('../models/user/group');
require('../models/user/user-assignment');

require('../models/testing/question');
require('../models/testing/section');
require('../models/testing/section-relation');
require('../models/testing/tag-attachment');
require('../models/testing/test-assignment');
require('../models/testing/test-submission');
require('../models/testing/test-request');

require('../models/tasks/file');
require('../models/tasks/task-assignment');
require('../models/tasks/task-submission');
require('../models/tasks/task');

require('../models/others/university');
require('../models/others/skills');

module.exports = mongoose;
