'use client'; 
import secureFetch from "@/utils/securefetch";
import { useEffect, useState,useRef, } from "react";
// import { useRouter } from "next/navigation";
import { Clock, Check, CheckCheck, ArrowLeft } from "lucide-react";
import Avatar from '@mui/material/Avatar';
import ChatInputBar from "./ChatInputBar";
import { getSocket } from "../libs/socket";
import IconButton from '@mui/material/IconButton';
import { Trash2 } from "lucide-react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
export default function Chats({ wa_id }) {
   const socket = getSocket();
  //  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [conversation_id, setConversationId] = useState(null);
  const [waId, setWaId] = useState(null);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [from, setFrom] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
const messagesEndRef = useRef(null);
const [selectedMessageId, setSelectedMessageId] = useState(null);
const [open, setOpen] = useState(false);
const handleClickOpen = (messageId) => {
  setSelectedMessageId(messageId);
  setOpen(true);
};

 const handleClose = () => {
  setOpen(false);
  setSelectedMessageId(null);
};
 const handleDeleteMessage = async() => {
  if (selectedMessageId) {
    try {
      const response = await secureFetch('/deletemessage', { message_id: selectedMessageId }, 'POST');
     if (response.code === 1) {
        socket.emit("deleteMessage", { message_id: selectedMessageId, conversation_id });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
    
  }
  handleClose();
};
  useEffect(() => {
    if (wa_id) {
      setWaId(wa_id.waid);
      setName(wa_id.name);
      setProfilePic(wa_id.profilePic);
      setFrom(wa_id.from);
      setConversationId(wa_id.conversation_id);
    }
  }, [wa_id]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({   behavior: "smooth",
    block: "end",  });
  }, [messages]);
console.log("waId:", waId, "name:", name, "profilePic:", profilePic,conversation_id,'from:',from,'wa_id:',wa_id);
  useEffect(() => {
    if (wa_id && conversation_id) { 
      async function getmessages() {
        setIsLoading(true); 
        try {
          const response = await secureFetch('/getmessages', { conversation_id }, 'POST');
          if (response.code === 1) {
            setMessages(response.data);
          }
        } finally {
          setIsLoading(false); 
        }
      }
      getmessages();
    }
  }, [wa_id, conversation_id]);

  useEffect(() => {
   
    if (conversation_id) {
      socket.emit("join", { conversation_id });

      socket.on("receiveMessage", (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
        socket.emit("chatOpened", { waid: waId, conversation_id });
      });
socket.on("messageDeleted", ({ message_id }) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== message_id));
})
      socket.on("statusUpdated", (ids) => {
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
        socket.off("messageDeleted");
        
        socket.emit("leaveChat", conversation_id);
      };
    }
  }, [conversation_id, waId, from]);

  let wa_id2 = "";
  if (messages.length > 0) {
    const firstMsg = messages[0];
    if (firstMsg.from === waId) {
      wa_id2 = firstMsg.status.recipient_id;
    } else {
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

  if (!wa_id) {
    return (
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
    );
  }

  return (
    <div className="relative bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center w-full h-full">
      <div className="flex flex-col bg-[#161717]/80 w-full h-full overflow-hidden">
        <div className="bg-[#161717] px-4 md:px-6 py-3 md:py-4 flex items-center shadow-lg border-b border-gray-700 flex-shrink-0">
          {/* <ArrowLeft className="text-white mr-4 block md:hidden lg:hidden" onClick={()=>{router.push('/login')}}/> */}
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
          {isLoading ? (
            <div className="text-center text-gray-400">Loading messages...</div>
          ) : (
            messages.map((message) => {
              let isOwnMessage = message.from == waId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                      className={`max-w-[85%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg relative ${isOwnMessage ? 'bg-[#144D37] text-white' : 'bg-[#242626] text-white'}`}
                    >
                      <p className="text-sm md:text-base break-words">{message.text.body}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${isOwnMessage ? 'text-white' : 'text-gray-500'}`}>
                        <span className="text-xs">
                          {formatTime(message.timestamp)}
                        </span>
                        {isOwnMessage && (
                          <div className="flex items-center">
                            {getStatusIcon(message.status.status)}
                            <IconButton aria-label="delete" onClick={() => handleClickOpen(message.id)}>
                              <Trash2 className="w-4 h-4 text-stone-500 p-0 m-0" />
                            </IconButton>
                          </div>

                        )}
                      </div>
                    </div>
                  </div>
              
            );
            })
          )}
            <div ref={messagesEndRef} />
             <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="Delete Confirmation"
      aria-describedby="Delete the message? "
    >
      <DialogTitle id="Delete Confirmation">
        {"Are you sure you want to delete this message?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="Delete confirmation">
          Once deleted, the message cannot be recovered.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeleteMessage} >
          Delete this message
        </Button>
      </DialogActions>
    </Dialog>

        </div>
  
        {/* Message Input Placeholder */}
        <div className="px-3 md:px-6 py-3 md:py-4 flex-shrink-0">
          <ChatInputBar
            conversationId={{ wa_id: waId, conversation_id: conversation_id, wa_id2: wa_id2 }}
          />
        </div>

        <div className="md:hidden h-16 flex-shrink-0"></div>
      </div>
    </div>
  );
}