const mongoose = require('mongoose');

const { Schema } = mongoose;

const fileSchema = new Schema({
  url: { type: String, required: true },
  name: { type: String },
});

const File = mongoose.model('File', fileSchema);
module.exports = { File };
