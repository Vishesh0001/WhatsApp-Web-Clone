const { Server } = require('socket.io');
const { UserModel } = require('../modules/v1/user/models/user-model');


module.exports = (server) => {
  const io = new Server(server, {
    cors: {
          origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // console.log('New client connected:', socket.id);

    socket.on('join', async (conversation_id) => {
        //  console.log(`User ${conversation_id.conversation_id} joined`);
      socket.join(conversation_id.conversation_id);


    });

    socket.on('leaveChat',(conversation_id)=>{

      socket.leave(conversation_id)
         console.log(`room ${conversation_id} left`);
     
         
    })

   socket.on("deleteMessage", async({ message_id, conversation_id}) => {

    // console.log('in delete scoket',message_id, conversation_id);
    io.to(conversation_id).emit("messageDeleted", { message_id });
   })
  socket.on("sendMessage", async({  message,wa_id, conversation_id,wa_id2}) => {

    // console.log('in scoket',message,wa_id, conversation_id,wa_id2);
    let messageresponse = await  UserModel.createMessageAndStatus({message,wa_id,conversation_id,wa_id2})
    io.to(conversation_id).emit("receiveMessage", messageresponse);
  });
  socket.on('disconnect', () => {
      // console.log('Client disconnected:', socket.id);
  });
  socket.on("leaveAllRooms", () => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
        // console.log(`${socket.id} left room ${room}`);
      }
    });
  });
  socket.on("chatOpened", async(data) => {
    // console.log("Chat opened:", data);
  let response = await UserModel.markStatusesAsRead(data.waid,data.conversation_id)

  let conversation_id = data.conversation_id
    io.to(conversation_id).emit('statusUpdated',response)

  });
  });
};