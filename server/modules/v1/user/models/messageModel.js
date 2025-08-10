const Message = require('../models/Messages');
const Conversation = require('../models/Conversation');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async getMessagesByConversationId(conversationId, userId, userRole) {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return {
          code: 0,
          message: { keyword: 'Conversation not found' },
          data: [],
          status: 404,
        };
      }

      // Authorization: Customers must belong to the conversation
      if (userRole === 'customer' && !conversation.participants.includes(userId)) {
        return {
          code: 0,
          message: { keyword: 'Access denied' },
          data: [],
          status: 403,
        };
      }

      const messages = await Message.find({ conversation_id: conversationId }).sort({ timestamp: 1 });

      if (!messages || messages.length === 0) {
        return {
          code: 0,
          message: { keyword: 'No messages found' },
          data: [],
          status: 400,
        };
      }

      return {
        code: 1,
        message: { keyword: 'Messages found' },
        data: messages,
        status: 200,
      };
    } catch (error) {
      console.log('Message model error:', error.message);
      return {
        code: 0,
        message: { keyword: 'Internal Server Error' },
        data: [],
        status: 500,
      };
    }
  },

  async sendMessage(conversationId, senderId, content) {
    try {
      // console.log(conversationId,content,senderId)

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return {
          code: 0,
          message: { keyword: 'Conversation not found' },
          data: [],
          status: 404,
        };
      }

      const message = new Message({
        conversation_id: conversationId,
        sender: senderId,
        content,
        direction: 'outgoing', // From sender perspective
        status: 'sent',
        timestamp: new Date(),
         meta_msg_id: uuidv4() ,
      });

      await message.save();

      // Update conversation metadata
      conversation.last_message = content;
      conversation.last_message_time = message.timestamp;
      await conversation.save();

      return {
        code: 1,
        message: { keyword: 'Message sent' },
        data: message,
        status: 201,
      };
    } catch (error) {
      console.log('Send message error:', error.message);
      return {
        code: 0,
        message: { keyword: 'Internal Server Error' },
        data: [],
        status: 500,
      };
    }
  },
};
