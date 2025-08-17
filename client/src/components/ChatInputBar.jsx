"use client";

import { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { getSocket } from "../libs/socket";

export default function ChatInputBar({ conversationId }) {
  const {wa_id, conversation_id,wa_id2} = conversationId
  const [message, setMessage] = useState("");
  const socket = getSocket();

  async function onSend() {
    if (!message.trim()) return; 

    socket.emit("sendMessage", {
     message, wa_id, conversation_id , wa_id2      
    });

    setMessage(""); 
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex h-[52px] items-center gap-2 p-3 bg-[#242626] rounded-full  border-gray-200">
      {/* Attachment button */}
      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
        <Paperclip size={20} />
      </button>

      {/* Input container */}
    
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          className="w-full px-4 py-3 pr-12 bg-transparent rounded-full outline-none text-white placeholder-gray-500"
        />
        
        {/* Emoji button inside input */}
        <button className=" p-1 text-gray-500 hover:text-gray-700 transition-colors">
          <Smile size={20} />
        </button>


      {/* Send button */}
      <button 
        onClick={onSend}
        disabled={!message.trim()}
        className="p-3 rounded-full transition-all duration-200 bg-[#21A257] text-white hover:bg-[#1e8b4f]"
      >
        <Send size={20} />
      </button>
    </div>   
  );
}

