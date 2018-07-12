const mongoose = require('mongoose');

const { Schema } = mongoose;

const fileSchema = new Schema({
  url: { type: String, required: true },
});

const File = mongoose.model('File', fileSchema);
module.exports = { File };
