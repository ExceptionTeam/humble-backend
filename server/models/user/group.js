const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = { Group };
