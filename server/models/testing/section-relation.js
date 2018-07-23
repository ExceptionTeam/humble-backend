const mongoose = require('mongoose');

const { Schema } = mongoose;

const sectionRelationSchema = new Schema({
  sectionId: {
    type: Schema.Types.ObjectId, index: true, ref: 'Section',
  },
  sectionId: {
    type: Schema.Types.ObjectId, index: true, ref: 'Section',
  },
});

const SectionRelation = mongoose.model('SectionRelation', sectionRelationSchema);

module.exports = { SectionRelation };

