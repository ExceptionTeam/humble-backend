const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupSchema = new Schema({
  name: { type: String, required: true },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = { Group };
