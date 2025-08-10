const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  wa_id: { type: String, required: true, unique: true }, // Customer WhatsApp ID
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users in conversation
  last_message: { type: String, default: '' },
  last_message_time: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
