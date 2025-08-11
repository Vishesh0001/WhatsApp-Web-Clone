const mongoose = require('mongoose');

const payloadSchema = new mongoose.Schema({
  payload_type: { type: String, enum: ['message', 'status'], required: true },
  data: Object, // raw JSON payload
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payload', payloadSchema);
