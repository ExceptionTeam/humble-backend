const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, uppercase: true /*, enum: ['STUDENT', 'ADMIN', 'TEACHER']*/ },
  account: Schema.Types.Mixed,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
