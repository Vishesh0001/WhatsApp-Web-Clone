const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const common = require('../../../../utilities/common');
const ProcessedMessages = require('./processedMessage');

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

// const processedMessagesSchema = new mongoose.Schema({}, { strict: false, collection: 'processed_messages' });

const User = mongoose.model('User', userSchema);
// const ProcessedMessages = mongoose.model('processed_messages', processedMessagesSchema);

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

  async getprofile(wa_id) {
    try {
      const user = await User.findOne(
  { wa_id: wa_id },   
  { profilePic: 1,email:1, about:1, name: 1, role: 1, wa_id: 1, _id: 0 } 
);
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
          message: { keyword: 'profile found' },
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

  async getConversations(waId) {
    try { 
      let wa_id = waId.waId
  // get waidform bodyyyyy
// const docs = await ProcessedMessages.find({
  // "metaData.entry.changes.value.contacts.wa_id": "919937320320"
// });
const docs = await ProcessedMessages.find(
  { "metaData.entry.changes.value.contacts.wa_id": wa_id }
).lean();
//   { "metaData.entry.0.changes.0.value.contacts.0.wa_id": wa_id }
// ).toArray();

// Extract the messages arrays from each doc, flatten into one array
const messageArray = docs.flatMap(doc => 
  doc.metaData.entry[0].changes[0].value.messages || []
);

// console.log("Messages:", messageArray);
// Get message IDs
const messageIds = messageArray.map(msg => msg.id);
// console.log('message ids',messageIds);

// Get docs that have statuses whose `id` is in messageIds
const statusDocs = await ProcessedMessages.find({
  "metaData.entry.changes.value.statuses.id": { $in: messageIds }
}).lean();
// console.log('status',statusDocs);

// Extract all statuses into one flat array
// 2. Flatten all statuses from all entries & changes
const statusArray = statusDocs.flatMap(doc =>
  doc.metaData?.entry?.flatMap(e =>
    e.changes?.flatMap(c =>
      c.value?.statuses || []
    )
  ) || []
);

// 3. Map message ID → status
const statusMap = new Map(statusArray.map(st => [st.id, st.status]));
const mergedMessages = messageArray.map(msg => ({
  ...msg,
  status: statusMap.get(msg.id) || "unknown"
}));

// console.log("Merged result:", mergedMessages);
      return {
        code: 1,
        message: { keyword: 'success' },
        data: mergedMessages,
        status: 200,
      };
// return docs;
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
async getRecentMessages(role,wa_id){
try {
  // let query;
  if(role=='agent'){
  const docs = await User.find(
  { "role": 'customer' },{
    "wa_id":1
  }
).lean();
// console.log('asdads',docs);
let result = []
for (const key of docs) {
  // console.log(key.wa_id)
  let wa_id = key.wa_id
   let profilePic = await User.findOne({'wa_id':wa_id},{'profilePic':1})
   let doc = await ProcessedMessages.findOne(
    { "metaData.entry.changes.value.contacts.wa_id": wa_id },
    { "metaData.entry.changes.value": 1, _id: 0 }
  )
    .sort({ "metaData.entry.changes.value.messages.timestamp": -1 })
    .lean();
      doc.profilePic = profilePic?.profilePic || null;
  result.push(doc)
  }
    // console.log('dsdsd',doc);
         return {
        code: 1,
        message: { keyword: 'success' },
        data: result,
        status: 200,
      };
  }else{
    let profilePic = await User.findOne({'wa_id':wa_id},{'profilePic':1})
  let doc = await ProcessedMessages.findOne(
    { "metaData.entry.changes.value.contacts.wa_id": wa_id },
    { "metaData.entry.changes.value": 1, _id: 0 }
  )
    .sort({ "metaData.entry.changes.value.messages.timestamp": -1 })
    .lean();
    doc.profilePic = profilePic?.profilePic || null;
let result = [doc]
         return {
        code: 1,
        message: { keyword: 'success' },
        data: result,
        status: 200,
      };
    }
    // let v = doc.entry[0].value.messages[0]
// console.log('wwww',v)
//   { "metaData.entry.0.changes.0.value.contacts.0.wa_id": wa_id }
// ).toArray();

// Extract the messages arrays from each doc, flatten into one array
// const messageArray = docs.flatMap(doc => 
//   doc.metaData.entry[0].changes[0].value.messages || []
// );

// console.log("Messages:", messageArray);
// // Get message IDs
// const messageIds = messageArray.map(msg => msg.id);
// console.log('message ids',messageIds);
} catch (error) {
       return {
        code: 1,
        message: { keyword: 'internalserver error' },
        data: [],
        status: 500,
      };
}
}
  // async getMessages(conversationId, userId, role) {
  //   try {
  //     // console.log(`Fetching messages for conversationId: ${conversationId}, userId: ${userId}, role: ${role}, wa_id: ${wa_id}`);
  //     const wa_id = await User.findById(userId).select('wa_id');
  //     let query = {
  //       payload_type: 'whatsapp_webhook',
  //       'metaData.gs_app_id': `${conversationId}-app`,
  //       'metaData.entry.changes.value.messages': { $exists: true },
  //     };

  //     if (role !== 'agent') {
  //       query.$or = [
  //         { 'metaData.entry.changes.value.messages.from': wa_id },
  //         { 'metaData.entry.changes.value.contacts.wa_id': wa_id },
  //       ];
  //     }

  //     const messages = await ProcessedMessages.find(query)
  //       .sort({ 'metaData.entry.changes.value.messages.timestamp': 1 })
  //       .lean();

  //     console.log(`Found ${messages.length} messages for conversation ${conversationId}`);

  //     const formattedMessages = messages.map((msg) => ({
  //       _id: msg.metaData.entry[0].changes[0].value.messages[0].id,
  //       data: msg,
  //       status: msg.metaData.entry[0].changes[0].value.statuses?.[0]?.status || 'sent',
  //     }));

  //     return {
  //       code: 1,
  //       message: { keyword: 'success' },
  //       data: formattedMessages,
  //       status: 200,
  //     };
  //   } catch (error) {
  //     console.error('Error in getMessages:', error);
  //     return {
  //       code: 0,
  //       message: { keyword: 'txt_server_error' },
  //       data: [],
  //       status: 500,
  //     };
  //   }
  // }
}

module.exports = { UserModel: new UserModel(), User, ProcessedMessages };