import secureFetch from "@/utils/securefetch";
import { useEffect,useState } from "react";
import { Clock,Check,CheckCheck, } from "lucide-react";
import Avatar from '@mui/material/Avatar';
// import io from "socket.io-client";
import ChatInputBar from "./ChatInputBar";
import { getSocket } from "../libs/socket";

// const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL
// const socket = io(BACKEND_URL);

export default function Chats({wa_id}){
const[messages, setMessages] = useState([])
// const socket = getSocket 
// let role = wa_id.role
let waId = wa_id.waid
let name = wa_id.name
let profilePic = wa_id.profilePic
let from  = wa_id.from
let conversation_id = wa_id.conversation_id
// console.log(role,name,profilePic,waId,from)

useEffect(()=>{
if(wa_id){
  async function getmessages(){
    const response = await secureFetch('/getmessages',{conversation_id},'POST');
    // console.log('mesage response',respo/nse);
    if(response.code == 1){
      setMessages(response.data)
      // console.log(response.data);
      
      // setwaid2(response.data.status.recipient_id)
    }
  }
  getmessages();
}
},[wa_id]);

  useEffect(() => {
  const socket = getSocket()
  socket.emit("join", { conversation_id });

  socket.on("receiveMessage", (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  });

  socket.on("statusUpdated", (ids) => {
    // console.log("statusUpdated IDs:", ids);

    setMessages((prev) =>
      prev.map((msg) =>
        ids.includes(msg.id)
          ? { ...msg, status: { ...msg.status, status: "read" } }
          : msg
      )
    );
  });

  return () => {
    socket.off("receiveMessage");
    socket.off("statusUpdated"); 
    socket.emit("leaveChat", { wa_id1: waId, wa_id2: from });
  };
}, [conversation_id, waId, from]);
let wa_id2 = "";
if (messages.length > 0) {
  const firstMsg = messages[0];
  if (firstMsg.from === waId) {
    // I sent the message → other side is recipient
    wa_id2 = firstMsg.status.recipient_id;
  } else {
    // I received the message → other side is sender
    wa_id2 = firstMsg.from;
  }
}
 const formatTime = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
 const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };


if(!wa_id){
  return(
 <div className="flex flex-1 items-center justify-center bg-black w-full h-full p-6">
  <div className="flex flex-col items-center text-center max-w-xl space-y-4">
    <img 
      src="https://i.gadgets360cdn.com/large/whatsapp_multi_device_support_update_image_1636207150180.jpg"       
      alt="WhatsApp Promo"
      className="w-48 md:w-64 opacity-80 rounded-2xl shadow-lg"
    />

    <h1 className="text-3xl md:text-4xl font-semibold text-white">
      Download WhatsApp for Windows
    </h1>

    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
      Make calls, share your screen, and get a faster experience when you download the app.
    </p>
  </div>
</div>

  )
}
return(
    <div className="relative bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center w-full h-full">
    <div className="flex flex-col bg-[#161717]/80 w-full h-full overflow-hidden">

      <div className="bg-[#161717] px-4 md:px-6 py-3 md:py-4 flex items-center shadow-lg border-b border-gray-700 flex-shrink-0">
 
        
        <Avatar 
          alt="user" 
          src={profilePic} 
          sx={{ 
            width: { xs: 36, md: 40 }, 
            height: { xs: 36, md: 40 } 
          }}
        />
        <div className="ml-3 md:ml-4">
          <h3 className="font-semibold text-white text-sm md:text-base">{name}</h3>
 
        </div>
      </div>

      {/* Messages Container - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-3 md:space-y-4">
        {messages.map((message) => {
           let isOwnMessage = message.from ==waId
           console.log('message',message);
          //  console.log(mess);
           
        //   if(role== 'agent'){isOwnMessage= message.from != waId}
        // else{ isOwnMessage = message.from == waId;}
          // console.log('isown',message.from,waId,message.status)
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg relative ${
                  isOwnMessage
                    ? 'bg-[#144D37] text-white'
                    : 'bg-[#242626] text-white'
                }`}
              >
                <p className="text-sm md:text-base break-words">{message.text.body}</p>
                
                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                  isOwnMessage ? 'text-white' : 'text-gray-500'
                }`}>
                  <span className="text-xs">
                    {formatTime(message.timestamp)}
                  </span>
                  {isOwnMessage && (
                    <div className="flex items-center">
                      {getStatusIcon(message.status.status)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input Placeholder */}
      <div className="px-3 md:px-6 py-3 md:py-4 flex-shrink-0">
   
          <ChatInputBar
      conversationId={{ wa_id:waId,conversation_id:conversation_id,wa_id2:wa_id2}}
    />
      
      </div>

      <div className="md:hidden h-16 flex-shrink-0"></div>
    </div>
  </div>
)


}