const mongoose = require('mongoose');

const processedMessagesSchema = new mongoose.Schema(
  {}, // no predefined fields
  { strict: false, collection: 'processed_messages' }
);

const ProcessedMessages = mongoose.model('processed_messages', processedMessagesSchema);

module.exports = ProcessedMessages;
