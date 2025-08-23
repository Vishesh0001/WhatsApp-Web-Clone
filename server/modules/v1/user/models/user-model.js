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
      let conversationId = waId.conversation_id;
  // get waidform bodyyyyy
// console.log('0000conversationiddd',conversationId);

const docs = await ProcessedMessages.find(
  { "conversationId": conversationId }
).lean();
// console.log(docs);

// Extract the messages arrays from each doc, flatten into one array
// const messageArray = docs.flatMap(doc =>{ 
//   doc.metaData.entry[0].changes[0].value.messages || [],
//   doc.conversationId}
// );
const messageArray = docs.flatMap(doc => {
  const messages = doc.metaData?.entry?.[0]?.changes?.[0]?.value?.messages || [];
  return messages.map(msg => ({
    ...msg,
    conversationId: doc.conversationId
  }));
});
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
const statusMap = new Map(statusArray.map(st => [st.id, {status:st.status,recipient_id:st.recipient_id}]));
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
// async getRecentMessages(role,wa_id){
// try {
//   // let query;
//   if(role=='agent'){
//   const docs = await User.find(
//   { "role": 'customer' },{
//     "wa_id":1
//   }
// ).lean();
// // console.log('asdads',docs);
// let result = []
// for (const key of docs) {
//   // console.log(key.wa_id)
//   let wa_id = key.wa_id
//    let profilePic = await User.findOne({'wa_id':wa_id},{'profilePic':1})
//    let doc = await ProcessedMessages.findOne(
//     { "metaData.entry.changes.value.contacts.wa_id": wa_id },
//     { "metaData.entry.changes.value": 1, _id: 0 }
//   )
//     .sort({ "metaData.entry.changes.value.messages.timestamp": -1 })
//     .lean();
//       doc.profilePic = profilePic?.profilePic || null;
//   result.push(doc)
//   }
//     // console.log('dsdsd',doc);
//          return {
//         code: 1,
//         message: { keyword: 'success' },
//         data: result,
//         status: 200,
//       };
//   }else{
//     let profilePic = await User.findOne({'wa_id':wa_id},{'profilePic':1})
//   let doc = await ProcessedMessages.findOne(
//     { "metaData.entry.changes.value.contacts.wa_id": wa_id },
//     { "metaData.entry.changes.value": 1, _id: 0 }
//   )
//     .sort({ "metaData.entry.changes.value.messages.timestamp": -1 })
//     .lean();
//     doc.profilePic = profilePic?.profilePic || null;
// let result = [doc]
// //  console.dir(result, { depth: null, colors: true });
  
//          return {
//         code: 1,
//         message: { keyword: 'success' },
//         data: result,
//         status: 200,
//       };
//     }
//     // let v = doc.entry[0].value.messages[0]
// // console.log('wwww',v)
// //   { "metaData.entry.0.changes.0.value.contacts.0.wa_id": wa_id }
// // ).toArray();

// // Extract the messages arrays from each doc, flatten into one array
// // const messageArray = docs.flatMap(doc => 
// //   doc.metaData.entry[0].changes[0].value.messages || []
// // );

// // console.log("Messages:", messageArray);
// // // Get message IDs
// // const messageIds = messageArray.map(msg => msg.id);
// // console.log('message ids',messageIds);
// } catch (error) {
//        return {
//         code: 1,
//         message: { keyword: 'internalserver error' },
//         data: [],
//         status: 500,
//       };
// }
// }
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


  async getRecentMessages(role,waId){
try {
  let query;
  if(role=='agent'){
     query = 'customer'}
     else{
      query = 'agent'
     }
  const docs = await User.find(
  { "role": query },{
    "wa_id":1
  }
).lean();
// console.log('asdads',docs);
let result = []
for (const key of docs) {
  
  let wa_id
  // console.log(key.wa_id)

   let profilePic = await User.findOne({'wa_id':key.wa_id},{'profilePic':1,'name':1})
  //  console.log(profilePic);
     if(role=='agent'){wa_id = key.wa_id}
  else{wa_id= waId}
   let doc = await ProcessedMessages.findOne(
    { "metaData.entry.changes.value.contacts.wa_id": wa_id },
    { _id: 1,"payload_type":1,"conversationId":1}
  )
    .lean();
    // console.log(doc);
    
    let id = doc.conversationId
    // console.log(id);
    
  let docs = await ProcessedMessages.find(
  { conversationId: id },
  { "metaData.entry.changes.value.messages": 1,"conversationId":1, _id: 0 }
).lean();
// console.log(docs);

// Extract messages from all docs
let allMessages = docs.flatMap(doc =>
  doc.metaData?.entry?.flatMap(e =>
    e.changes?.flatMap(c =>
      (c.value?.messages || []).map(m => ({
        ...m,
        conversationId: doc.conversationId
      }))
    )
  ) || []
);

// Sort in JS
allMessages.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

// console.dir(allMessages, { depth: null, colors: true });

// latest message
let lastMsg = allMessages[0];
    
      lastMsg.profilePic = profilePic?.profilePic || null;
        lastMsg.name = profilePic?.name || null;
  result.push(lastMsg)
  }
    // console.log('dsdsd',doc);
         return {
        code: 1,
        message: { keyword: 'success' },
        data: result,
        status: 200,
      };

} catch (error) {
  console.log('error',error.message);
  
       return {
        code: 0,
        message: { keyword: 'internalserver error' },
        data: [],
        status: 500,
      };
}
}
async createMessageAndStatus ({ message, wa_id, conversation_id,wa_id2 }){
  // 1️⃣ Find latest message for wa_id1
try{ 
  const newText = message
  // console.log('texttt', newText, wa_id, conversation_id);
let  wa_id1 = String(wa_id);
  // wa_id2 = String(wa_id2)
  // console.log('***',wa_id1);
  
  const latestMsgDoc = await ProcessedMessages.findOne({
   "conversationId":conversation_id
  })
    .sort({ 'metaData.entry.changes.value.messages.timestamp': -1 })
    .lean();


  if (!latestMsgDoc) throw new Error("No message found for this wa_id");

  // 2️⃣ Clone and update message doc
  const newMsgDoc = JSON.parse(JSON.stringify(latestMsgDoc));
// console.dir(newMsgDoc, { depth: null, colors: true });
  // Increment _id's msg number
  const [convPart, msgPart] = latestMsgDoc._id.split('-');
  const msgNum = parseInt(msgPart.replace("msg", ""), 10) + 1;
  newMsgDoc._id = `${convPart}-msg${msgNum}-api`;

  // Increment meta entry id
  let metaEntryId = parseInt(newMsgDoc.metaData.entry[0].id, 10) + 1;
  newMsgDoc.metaData.entry[0].id = metaEntryId.toString();

  // Update timestamp to current
  const newTimestamp = Math.floor(Date.now() / 1000).toString();
  newMsgDoc.metaData.entry[0].changes[0].value.messages[0].timestamp = newTimestamp;
newMsgDoc.metaData.entry[0].changes[0].value.contacts[0].wa_id = wa_id1;
  // Update text body
  newMsgDoc.metaData.entry[0].changes[0].value.messages[0].text.body = newText;
 newMsgDoc.metaData.entry[0].changes[0].value.messages[0].from = wa_id1
  // Generate new message ID (random digits)
  const oldMsgId = newMsgDoc.metaData.entry[0].changes[0].value.messages[0].id;
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const newMsgId = oldMsgId.split("=")[0] + "=" + randomDigits;

  newMsgDoc.metaData.entry[0].changes[0].value.messages[0].id = newMsgId;

  // Insert new message doc
  const insertedMsg = await ProcessedMessages.create(newMsgDoc);

  // 3️⃣ Find latest status doc for same conversation
  const latestStatusDoc = await ProcessedMessages.findOne({
    payload_type: 'whatsapp_webhook',
    'metaData.entry.changes.value.statuses': { $exists: true },
    'metaData.entry.changes.value.statuses.id': latestMsgDoc.metaData.entry[0].changes[0].value.messages[0].id
  }).lean();

  if (!latestStatusDoc) throw new Error("No status found for this message");

  // 4️⃣ Clone and update status doc
  const newStatusDoc = JSON.parse(JSON.stringify(latestStatusDoc));

  // Increment _id msg number
  newStatusDoc._id = `${convPart}-msg${msgNum}-status`;

  // Increment meta entry id
  metaEntryId = parseInt(newStatusDoc.metaData.entry[0].id, 10) + 1;
  newStatusDoc.metaData.entry[0].id = metaEntryId.toString();

  // Keep status "delivered" and set recipient_id = wa_id2
  newStatusDoc.metaData.entry[0].changes[0].value.statuses[0].status = "delivered";
  newStatusDoc.metaData.entry[0].changes[0].value.statuses[0].recipient_id = wa_id2;

  // Update id and meta_msg_id to match new message ID
  newStatusDoc.metaData.entry[0].changes[0].value.statuses[0].id = newMsgId;
  newStatusDoc.metaData.entry[0].changes[0].value.statuses[0].meta_msg_id = newMsgId;

  // Update timestamp
  newStatusDoc.metaData.entry[0].changes[0].value.statuses[0].timestamp = newTimestamp;

  // Insert new status doc
  const insertedStatus = await ProcessedMessages.create(newStatusDoc);

  const data = await this.getConversations({conversation_id:conversation_id})
//  console.dir(data, { depth: null, colors: true });
  
  let datalength = data.data.length;
  const messageobj = data.data[datalength-1]
  // console.log('mesgaesent',messageobj);
  
  return (messageobj);
}catch(error){
  console.log('error',error.message)
}
};
async deleteMessage(msg_id){
  try {
    // Find and delete the message document
    let message_id = msg_id.message_id
      const deletedMessage = await ProcessedMessages.findOneAndDelete({
      "metaData.entry.changes.value.messages.id": message_id
    });

    if (!deletedMessage) {
      return {
        code: 0,
        message: { keyword: 'Message not found' },
        data: [],
        status: 404,
      };
    }


    await ProcessedMessages.deleteMany({
      "metaData.entry.changes.value.statuses.id": message_id
    });

    return {
      code: 1,
      message: { keyword: 'Message deleted successfully' },
      data: { deletedMessageId: message_id },
      status: 200,
    };
  } catch (error) {
    console.log('deleteMessage error:', error.message);
    return {
      code: 0,
      message: { keyword: 'internal server Error' },
      data: [],
      status: 500,
    };
  }
}


async markStatusesAsRead(wa_id, conversationId) {
  try {


    const docs = await ProcessedMessages.find({ conversationId });
 let result=[]

    if (!docs.length) {
 
      return;
    }

    for (let docIdx = 0; docIdx < docs.length; docIdx++) {
      let doc = docs[docIdx];
      let updated = false;

      doc.metaData?.entry?.forEach((entry, entryIdx) => {
   

        entry.changes?.forEach((change, changeIdx) => {
          let statuses = change?.value?.statuses || [];
    

          statuses.forEach((status, statusIdx) => {
    

            if (status.recipient_id == wa_id) {
              status.status = "read";
              status.timestamp = Math.floor(Date.now() / 1000).toString();
              result.push(status.id)
              updated = true;
            } else {console.log('didnot found status');
            
            }
          });
        });
      });

    
      if (updated) {
          doc.markModified("metaData");
        await doc.save();
      } else {console.log('did not updated');
      
      }
    }
return result
  } catch (err) {
    console.error("❌ Error updating statuses:", err);
  }
}





}


module.exports = { UserModel: new UserModel(), User, ProcessedMessages };