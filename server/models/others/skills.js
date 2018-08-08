const mongoose = require('mongoose');

const { Schema } = mongoose;

const skillsSchema = new Schema({
  name: { type: String, required: true },
});

const Skills = mongoose.model('Skills', skillsSchema);

module.exports = { Skills };
