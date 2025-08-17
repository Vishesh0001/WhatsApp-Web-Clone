const mongoose = require('mongoose');

const processedMessagesSchema = new mongoose.Schema(
  {  _id: { type: String }, }, // no predefined fields
  { strict: false, collection: 'newprocessedmessages' }
);

const ProcessedMessages = mongoose.model('processed_messages', processedMessagesSchema);

module.exports = ProcessedMessages;
