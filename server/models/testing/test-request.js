const mongoose = require('mongoose');

const { Schema } = mongoose;

const REQUEST_STATUS_PENDING = 'PENDING';
const REQUEST_STATUS_APPROVED = 'APPROVED';
const REQUEST_STATUS_REJECTED = 'REJECTED';


const requestSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  userId: {
    type: Schema.Types.ObjectId, required: true, index: true, ref: 'User',
  },
  section: { type: String, required: true, index: true },
  status: {
    type: String,
    required: true,
    index: true,
    enum: [REQUEST_STATUS_PENDING, REQUEST_STATUS_APPROVED, REQUEST_STATUS_REJECTED],
  },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = {
  Request,
  REQUEST_STATUS_APPROVED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_REJECTED,
};
