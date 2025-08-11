const { Server } = require('socket.io');
const { User, ProcessedMessages } = require('../modules/v1/user/models/user-model');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', async (wa_id) => {
      console.log(`User ${wa_id} joined`);
      socket.join(wa_id);

      try {
        let query = {
          payload_type: 'whatsapp_webhook',
          'metaData.entry.changes.value.messages': { $exists: true },
          $or: [
            { 'metaData.entry.changes.value.messages.from': wa_id },
            { 'metaData.entry.changes.value.contacts.wa_id': wa_id },
          ],
        };

        const user = await User.findOne({ wa_id });
        if (user?.role === 'agent') {
          query = {
            payload_type: 'whatsapp_webhook',
            'metaData.entry.changes.value.messages': { $exists: true },
          };
        }

        const messages = await ProcessedMessages.find(query)
          .sort({ 'metaData.entry.changes.value.messages.timestamp': -1 })
          .lean();

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
        socket.emit('initial_conversations', conversations);
      } catch (error) {
        console.error('Error fetching initial conversations:', error);
        socket.emit('error', 'Failed to load conversations');
      }
    });

    socket.on('new_message', async ({ sender_wa_id, receiver_wa_id, messageDoc, statusDoc }) => {
      try {
        const messageId = `${messageDoc.metaData.gs_app_id.split('-')[0]}-msg${Date.now()}-user`;
        const statusId = `${statusDoc.meta_data.gs_app_id.split('-')[0]}-msg${Date.now()}-status`;

        await ProcessedMessages.create([
          { ...messageDoc, _id: messageId },
          { ...statusDoc, _id: statusId },
        ]);

        io.to(sender_wa_id).emit('new_message', {
          conversationId: messageDoc.metaData.gs_app_id.split('-')[0],
          message: { ...messageDoc, _id: messageId },
        });
        io.to(receiver_wa_id).emit('new_message', {
          conversationId: messageDoc.metaData.gs_app_id.split('-')[0],
          message: { ...messageDoc, _id: messageId },
        });

        setTimeout(async () => {
          const updatedStatusDoc = {
            ...statusDoc,
            meta_data: {
              ...statusDoc.meta_data,
              entry: [
                {
                  ...statusDoc.meta_data.entry[0],
                  changes: [
                    {
                      ...statusDoc.meta_data.entry[0].changes[0],
                      value: {
                        ...statusDoc.meta_data.entry[0].changes[0].value,
                        statuses: [
                          {
                            ...statusDoc.meta_data.entry[0].changes[0].value.statuses[0],
                            status: 'delivered',
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          };

          await ProcessedMessages.updateOne(
            { _id: statusId },
            { $set: updatedStatusDoc }
          );
          io.to(sender_wa_id).emit('update_status', {
            conversationId: messageDoc.metaData.gs_app_id.split('-')[0],
            status: updatedStatusDoc.meta_data.entry[0].changes[0].value.statuses[0],
          });
        }, 1000);
      } catch (error) {
        console.error('Error handling new message:', error);
        socket.emit('error', 'Failed to send message: ' + error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};