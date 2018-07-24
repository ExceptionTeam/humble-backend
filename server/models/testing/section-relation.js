const mongoose = require('mongoose');

const { Schema } = mongoose;

const sectionRelationSchema = new Schema({
  child: {
    type: Schema.Types.ObjectId, index: true, ref: 'Section',
  },
  parent: {
    type: Schema.Types.ObjectId, index: true, ref: 'Section',
  },
});

const SectionRelation = mongoose.model('SectionRelation', sectionRelationSchema);

module.exports = { SectionRelation };

