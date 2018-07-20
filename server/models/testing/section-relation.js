const mongoose = require('mongoose');

const { Schema } = mongoose;

const sectionRelationSchema = new Schema({
  parentId: {
    type: Schema.Types.ObjectId, index: true, ref: 'Parent',
  },
  childId: {
    type: Schema.Types.ObjectId, index: true, ref: 'Child',
  },
});

const SectionRelation = mongoose.model('SectionRelation', sectionRelationSchema);

module.exports = { SectionRelation };

