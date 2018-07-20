const mongoose = require('mongoose');

const { Schema } = mongoose;

const sectionSchema = new Schema({
  name: { type: String, required: true, ref: 'Section' },
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = { Section };
