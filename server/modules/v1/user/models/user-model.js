const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const common = require('../../../../utilities/common');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  role: { type: String, enum: ['customer', 'agent'] },
  profilePic: String,
  about: String,
  phone: String,
  wa_id: String,
  createdAt: Date,
  updatedAt: Date,
}, { collection: 'users' });

const processedMessagesSchema = new mongoose.Schema({}, { strict: false, collection: 'processed_messages' });

const User = mongoose.model('User', userSchema);
const ProcessedMessages = mongoose.model('processed_messages', processedMessagesSchema);

class UserModel {
  async login(requestd) {
    try {
      const request_data = JSON.parse(requestd);
      let email = request_data.email;

      const user = await User.findOne({ email });
      if (!user) {
        return {
          code: 0,
          message: { keyword: 'No user found' },
          data: [],
          status: 400,
        };
      }

      const isMatch = await bcrypt.compare(request_data.password, user.passwordHash);
      if (isMatch) {
        let role = user.role;
        let id = user._id;
        let wa_id = user.wa_id;
        let generatedToken = common.generateToken(id, role, wa_id);
        return {
          code: 1,
          message: { keyword: 'Login Success!' },
          data: { token: generatedToken, wa_id: user.wa_id, name: user.name, profilePic: user.profilePic },
          status: 200,
        };
      } else {
        return {
          code: 0,
          message: { keyword: 'Invalid Credentials' },
          data: [],
          status: 400,
        };
      }
    } catch (error) {
      console.log('login error:', error.message);
      return {
        code: 4,
        message: { keyword: 'internal server Error' },
        data: [],
        status: 500,
      };
    }
  }

  async getUsers(role) {
    try {
      let user;
      if (role === 'customer') {
        user = await User.find({ role: 'agent' });
      } else if (role === 'agent') {
        user = await User.find({ role: 'customer' });
      } else {
        return {
          code: 0,
          message: { keyword: 'Invalid role' },
          data: [],
          status: 403,
        };
      }

      if (!user || user.length === 0) {
        return {
          code: 0,
          message: { keyword: 'No users found' },
          data: [],
          status: 400,
        };
      } else {
        return {
          code: 1,
          message: { keyword: 'users found' },
          data: user,
          status: 200,
        };
      }
    } catch (error) {
      console.log('model error', error.message);
      return {
        code: 0,
        message: { keyword: 'internal server Error' },
        data: [],
        status: 500,
      };
    }
  }

  async getprofilepic(id) {
    try {
      const user = await User.findById(id, { profilePic: 1, name: 1, role: 1, wa_id: 1 });
      if (!user) {
        return {
          code: 0,
          message: { keyword: 'No users found' },
          data: [],
          status: 400,
        };
      } else {
        return {
          code: 1,
          message: { keyword: 'pic found' },
          data: [user],
          status: 200,
        };
      }
    } catch (error) {
      console.log('model error', error.message);
      return {
        code: 0,
        message: { keyword: 'internal server Error' },
        data: [],
        status: 500,
      };
    }
  }

  async getConversations(userId, role) {
    try { const wa_id = await User.findById(userId).select('wa_id');
      // console.log(`Fetching conversations for userId: ${userId}, role: ${role}, wa_id: ${wa_id}`);
      
      let query = {
        payload_type: 'whatsapp_webhook',
        'metaData.entry.changes.value.messages': { $exists: true },
        $or: [
          { 'metaData.entry.changes.value.messages.from': wa_id },
          { 'metaData.entry.changes.value.contacts.wa_id': wa_id },
        ],
      };

      if (role === 'agent') {
        query = {
          payload_type: 'whatsapp_webhook',
          'metaData.entry.changes.value.messages': { $exists: true },
        };
      }

      const messages = await ProcessedMessages.find(query)
        .sort({ 'metaData.entry.changes.value.messages.timestamp': -1 })
        .lean();

      console.log(`Found ${messages.length} messages in processed_messages`);

      const conversations = [];
      const convMap = new Map();

      for (const message of messages) {
        const conversationId = message.metaData.gs_app_id.split('-')[0];
        if (!convMap.has(conversationId)) {
          const msgData = message.metaData.entry[0].changes[0].value.messages[0];
          const contact = message.metaData.entry[0].changes[0].value.contacts[0];
          const otherWaId = msgData.from === wa_id ? contact.wa_id : msgData.from;
          
          const otherUser = await User.findOne({ wa_id: otherWaId }).lean();
          const currentUser = await User.findOne({ wa_id }).lean();
          
          const participants = [
            { 
              wa_id, 
              name: currentUser?.name || 'User', 
              profilePic: currentUser?.profilePic || 'https://placehold.co/600x400?text=User'
            },
            { 
              wa_id: otherWaId, 
              name: otherUser?.name || contact.profile.name || 'User',
              profilePic: otherUser?.profilePic || 'https://placehold.co/600x400?text=User'
            },
          ];

          convMap.set(conversationId, {
            conversationId,
            participants,
            lastMessage: { data: message },
          });
        }
      }

      convMap.forEach((conv) => conversations.push(conv));
      
      console.log('Conversations:', conversations);

      return {
        code: 1,
        message: { keyword: 'success' },
        data: conversations,
        status: 200,
      };
    } catch (error) {
      console.error('Error in getConversations:', error);
      return {
        code: 0,
        message: { keyword: 'txt_server_error' },
        data: [],
        status: 500,
      };
    }
  }

  async getMessages(conversationId, userId, role) {
    try {
      // console.log(`Fetching messages for conversationId: ${conversationId}, userId: ${userId}, role: ${role}, wa_id: ${wa_id}`);
      const wa_id = await User.findById(userId).select('wa_id');
      let query = {
        payload_type: 'whatsapp_webhook',
        'metaData.gs_app_id': `${conversationId}-app`,
        'metaData.entry.changes.value.messages': { $exists: true },
      };

      if (role !== 'agent') {
        query.$or = [
          { 'metaData.entry.changes.value.messages.from': wa_id },
          { 'metaData.entry.changes.value.contacts.wa_id': wa_id },
        ];
      }

      const messages = await ProcessedMessages.find(query)
        .sort({ 'metaData.entry.changes.value.messages.timestamp': 1 })
        .lean();

      console.log(`Found ${messages.length} messages for conversation ${conversationId}`);

      const formattedMessages = messages.map((msg) => ({
        _id: msg.metaData.entry[0].changes[0].value.messages[0].id,
        data: msg,
        status: msg.metaData.entry[0].changes[0].value.statuses?.[0]?.status || 'sent',
      }));

      return {
        code: 1,
        message: { keyword: 'success' },
        data: formattedMessages,
        status: 200,
      };
    } catch (error) {
      console.error('Error in getMessages:', error);
      return {
        code: 0,
        message: { keyword: 'txt_server_error' },
        data: [],
        status: 500,
      };
    }
  }
}

module.exports = { UserModel: new UserModel(), User, ProcessedMessages };