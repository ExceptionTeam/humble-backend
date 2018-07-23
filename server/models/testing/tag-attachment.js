const mongoose = require('mongoose');

const { Schema } = mongoose;

const tagAttachmentSchema = new Schema({
  tag: { type: String, required: true },
  sectionId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'Section',
  },
});

const TagAttachment = mongoose.model('TagAttachment', tagAttachmentSchema);

module.exports = { TagAttachment };
