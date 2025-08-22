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
    console.log('New client connected:', socket.id);

    socket.on('join', async (conversation_id) => {
         console.log(`User ${conversation_id.conversation_id} joined`);
      socket.join(conversation_id.conversation_id);


    });
    // socket.on('joinchats', async (data) => {
    //   console.log(`User joined chat history: ${data.name}`);
    //   socket.join('chathistory');
    //   // You can implement logic to handle chat history here
    // });
    socket.on('leaveChat',(conversation_id)=>{
  // let wa_id1 = Number(wa_id.wa_id1);
  //    let wa_id2 = Number(wa_id.wa_id2)
      // console.log(wa_id1,Math.min(wa_id1, wa_id2),wa_id2);
 
      // let roomName = "chat:" + Math.min(wa_id1, wa_id2) + "-" + Math.max(wa_id1, wa_id2)
      socket.leave(conversation_id)
         console.log(`room ${conversation_id} left`);
        //  console.log(wa_id.id);
         
    })

   

  socket.on("sendMessage", async({  message,wa_id, conversation_id,wa_id2}) => {
    // Save message to DB here
    console.log('in scoket',message,wa_id, conversation_id,wa_id2);
    let messageresponse = await  UserModel.createMessageAndStatus({message,wa_id,conversation_id,wa_id2})
    // console.log('messageresponse',messageresponse);

    io.to(conversation_id).emit("receiveMessage", messageresponse);
    // io.to('chathistory').emit("receiveMessage", messageresponse);
  });
  socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
  });

  socket.on("chatOpened", async(data) => {
    console.log("Chat opened:", data);
  let response = await UserModel.markStatusesAsRead(data.waid,data.conversation_id)
  console.log('sts id s',response);
  let conversation_id = data.conversation_id
    io.to(conversation_id).emit('statusUpdated',response)
    // ✅ Update DB status here (e.g., mark as read/seen)
  });
  });
};