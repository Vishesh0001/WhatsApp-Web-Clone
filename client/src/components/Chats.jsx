// 'use client'
// import { EllipsisVertical, MessageSquarePlus,Search } from "lucide-react";
// import { useEffect } from "react";
// // import { encrypt,decrypt } from "@/utils/crypto";
// import { useState } from "react";
// import secureFetch from "@/utils/securefetch";

// export default function Chats(){
 
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getusers = async () => {
//     try {
//       const res = await secureFetch('/users',{},'GET')
   
//       // console.log('dec',decrypteddata)
//       setUsers(res.data || []);
//     } catch (error) {
//    console.log(error);
   
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getusers();
//   }, []);


//     return(<>
//         <nav className="fixed top-0 bg-[#161717] h-[140px] w-[462px]">
//             <div className="flex justify-between items-center">
// <div className="px-[20px] py-[18px] font-semibold text-[20px] text-white font-sans ">WhatsApp</div>
// <div className="flex mr-[30px]">
// <div className="p-[10px]"><MessageSquarePlus className="text-white"/></div>
// <div className="p-[10px]"><EllipsisVertical className="text-white"/></div>
//       </div>
//       </div>
//        <div className="w-full bg-[#161717] px-4 py-2">
//       <div className="flex items-center bg-[#2E2F2F] rounded-full px-3 py-2">
//         <Search className="text-gray-400 w-5 h-5 mr-2" />
//         <input
//           type="text"
//           placeholder="Search or start new chat"
//           className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
//         />
//       </div>
//     </div>
//         </nav>
//         {users.map((user)=>(
//           <div key ={user._id} className="bg-black text-white" >{user.name}</div>
//         ))}
//         </>
//     )
// }
'use client'
import { EllipsisVertical, MessageSquarePlus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import secureFetch from "@/utils/securefetch";
import ChatInputBar from "./ChatInputBar";

export default function Chats() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch conversations for the logged-in user
  const getConversations = async () => {
    try {
      setLoadingConvos(true);
      const res = await secureFetch('/conversations', {}, 'GET');
      setConversations(res.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    } finally {
      setLoadingConvos(false);
    }
  };

  // Fetch messages for a selected conversation
  const getMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const res = await secureFetch(`/conversations/${conversationId}/messages`, {}, 'GET');
      setMessages(res.data || []);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Handle selecting a conversation from the list
  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    getMessages(conversation._id);
  };

  useEffect(() => {
    getConversations();
  }, []);

  // Format timestamp to readable time/date
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 bg-[#161717] h-[140px] w-[462px] z-10">
        <div className="flex justify-between items-center px-5 py-4">
          <div className="font-semibold text-[20px] text-white font-sans">WhatsApp</div>
          <div className="flex space-x-3 mr-[30px]">
            <MessageSquarePlus className="text-white cursor-pointer" />
            <EllipsisVertical className="text-white cursor-pointer" />
          </div>
        </div>
        <div className="w-full bg-[#161717] px-4 py-2">
          <div className="flex items-center bg-[#2E2F2F] rounded-full px-3 py-2">
            <Search className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
            />
          </div>
        </div>
      </nav>

      {/* Conversations List */}
      <div className="mt-[140px] max-h-[calc(100vh-140px)] overflow-y-auto bg-black w-[462px] border-t border-gray-900">
        {loadingConvos ? (
          <div className="p-4 text-white text-center">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-white text-center">No conversations found.</div>
        ) : (
          conversations.map((conv) => {
            // Find the other participant (for simplicity show first participant different from self)
            const participant = conv.participants.find(p => p._id !== null) || conv.participants[0];
            return (
              <div
                key={conv._id}
                className={`flex items-center p-4 border-b border-gray-800 cursor-pointer hover:bg-[#2a3942] transition-colors ${
                  selectedConversation?._id === conv._id ? 'bg-[#2a3942]' : ''
                }`}
                onClick={() => selectConversation(conv)}
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">
                    {participant?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-white font-semibold truncate">{participant?.name || "User"}</h3>
                    <span className="text-gray-400 text-sm">
                      {formatTime(conv.last_message_time)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm truncate pr-2">{conv.last_message || "...No messages yet"}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Messages Area */}
      {selectedConversation && (
        <div className="fixed top-[140px] left-[462px] right-0 bottom-0 bg-gray-900 flex flex-col">
          <div className="p-4 border-b border-gray-800 text-white font-semibold text-xl">
            {selectedConversation.participants.find(p => p._id !== null)?.name || "User"}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingMessages ? (
              <div className="text-white">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-white text-center">No messages yet.</div>
            ) : (
              messages.map((msg) => {
                const isOutgoing = msg.direction === 'outgoing';
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${isOutgoing ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'}`}>
                      <p>{msg.content}</p>
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {formatTime(msg.timestamp)}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
<ChatInputBar
  conversationId={selectedConversation._id}
  onMessageSent={(newMsg) => setMessages((msgs) => [...msgs, newMsg])}
/>
        </div>
      )}
    </>
  );
}
