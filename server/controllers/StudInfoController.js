mongoose = require('mongoose');
bodyParser = require('body-parser');
const models = require('../models/Models');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/mongoose_basics',  function (err) {
   if (err) throw err;
   console.log('Successfully connected');
});

function addStudInfo(StudInfo){
  var artem = new models.Group( {
    _id: new mongoose.Types.ObjectId(),
    name:"alala",
    teachers: [12314],
    students: [new mongoose.Types.ObjectId(15141),new mongoose.Types.ObjectId(52351241)]
  });

  artem.save(function(err) {
      if (err) throw err;
      console.log('Artem successfully saved.');
  });
};

module.exports.addStudInfo = addStudInfo;
