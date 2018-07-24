const mongoose = require('mongoose');

const { Schema } = mongoose;

const sectionRelationSchema = new Schema({
  section1Id: {
    type: Schema.Types.ObjectId, index: true, ref: 'Section',
  },
  section2Id: {
    type: Schema.Types.ObjectId, index: true, ref: 'Section',
  },
});

const SectionRelation = mongoose.model('SectionRelation', sectionRelationSchema);

module.exports = { SectionRelation };

