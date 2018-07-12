const mongoose = require('mongoose');

const { Schema } = mongoose;

const requestSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  userId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User',
  },
  section: { type: String, required: true, index: true },
  status: {
    type: String, required: true, index: true, uppercase: true,
    /* , enum: ['PENDING', 'APPROVED', 'REJECTED'] */ },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
