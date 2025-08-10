const Conversation = require('../models/Conversation');
const User = require('../models/User');

module.exports = {
async getConversationsByUserRole(role, userId) {
  try {
    let conversations;

    if (role === 'agent') {
      // Agents see conversations where they are participants, but exclude other agents
      conversations = await Conversation.find({
        participants: userId
      })
      .populate({
        path: 'participants',
        match: { role: 'customer' },  // Only show customers in participants
        select: 'name role wa_id'
      })
      .sort({ last_message_time: -1 });

    } else if (role === 'customer') {
      // Customers see conversations where they are participants, but exclude other customers
      conversations = await Conversation.find({
        participants: userId
      })
      .populate({
        path: 'participants',
        match: { role: 'agent' },  // Only show agents in participants
        select: 'name role wa_id'
      })
      .sort({ last_message_time: -1 });

    } else {
      return {
        code: 0,
        message: { keyword: 'Invalid role' },
        data: [],
        status: 403,
      };
    }

    if (!conversations || conversations.length === 0) {
      return {
        code: 0,
        message: { keyword: 'No conversations found' },
        data: [],
        status: 400,
      };
    }

    return {
      code: 1,
      message: { keyword: 'Conversations found' },
      data: conversations,
      status: 200,
    };
  } catch (error) {
    console.log('Conversation model error:', error.message);
    return {
      code: 0,
      message: { keyword: 'Internal Server Error' },
      data: [],
      status: 500,
    };
  }
}
,
};
